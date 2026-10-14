import { useEffect, useId } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, Line, Path, Rect } from 'react-native-svg';

import { brand } from '@/theme';

// The splash mark (hourglass-mark-splash.svg) redrawn so the sand can move. Its geometry is
// unchanged, and the first frame matches the static mark: top bulb full, bottom bulb as glass.

const TOP_BULB = 'M17.5 14H38.5L28 28Z';
const BOTTOM_BULB = 'M17.5 42H38.5L28 28Z';
const BULB = 14; // height of each bulb in viewBox units
const GLASS = 0.55; // empty-bulb opacity, from the mark

const CYCLE_MS = 3200; // one drain + one flip
const DRAIN = 0.75; // share of a cycle spent draining; the rest is the flip

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedLine = Animated.createAnimatedComponent(Line);

// t runs 0 → 2: two cycles, i.e. one full turn, so the loop restarts on an identical frame.
function phase(t: number) {
  'worklet';
  const cycle = Math.floor(t) % 2; // 0: upright, 1: upside down (sand starts in the SVG's bottom bulb)
  const u = t - Math.floor(t);
  const drained = Math.min(u / DRAIN, 1);
  const f = Math.max((u - DRAIN) / (1 - DRAIN), 0);
  const flip = f < 0.5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2; // ease in-out cubic
  return { cycle, drained, flip };
}

// Depth of sand in a bulb holding `amount` (0–1) of it. Bulbs are triangles, so depth isn't linear:
// sand resting at the neck fills the narrow tip, sand resting on the base fills the wide end.
function depthAtNeck(amount: number) {
  'worklet';
  return BULB * Math.sqrt(amount);
}
function depthAtBase(amount: number) {
  'worklet';
  return BULB * (1 - Math.sqrt(1 - amount));
}

function AnimatedHourglass({ size = 56 }: { size?: number }) {
  const t = useSharedValue(0);
  const reduceMotion = useReducedMotion();
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    if (reduceMotion) return;
    t.value = withRepeat(withTiming(2, { duration: CYCLE_MS * 2, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(t);
  }, [reduceMotion, t]);

  const spin = useAnimatedStyle(() => {
    const { cycle, flip } = phase(t.value);
    return { transform: [{ rotate: `${(cycle + flip) * 180}deg` }] };
  });

  // Gravity points at the SVG's bottom when upright and at its top when flipped.
  const topSand = useAnimatedProps(() => {
    const { cycle, drained } = phase(t.value);
    if (cycle === 0) {
      const depth = depthAtNeck(1 - drained);
      return { y: 28 - depth, height: depth };
    }
    return { y: 28 - BULB, height: depthAtBase(drained) };
  });

  const bottomSand = useAnimatedProps(() => {
    const { cycle, drained } = phase(t.value);
    if (cycle === 0) {
      const depth = depthAtBase(drained);
      return { y: 28 + BULB - depth, height: depth };
    }
    return { y: 28, height: depthAtNeck(1 - drained) };
  });

  // Thin stream from the neck down to the pile that's filling.
  const stream = useAnimatedProps(() => {
    const { cycle, drained } = phase(t.value);
    const pile = depthAtBase(drained);
    return {
      y2: cycle === 0 ? 28 + BULB - pile : 28 - BULB + pile,
      strokeOpacity: drained > 0 && drained < 1 ? 1 : 0,
    };
  });

  return (
    <Animated.View style={[{ width: size, height: size }, spin]}>
      <Svg width={size} height={size} viewBox="0 0 56 56">
        <Defs>
          <ClipPath id={`${id}top`}>
            <Path d={TOP_BULB} />
          </ClipPath>
          <ClipPath id={`${id}bottom`}>
            <Path d={BOTTOM_BULB} />
          </ClipPath>
        </Defs>
        <Path d={TOP_BULB} fill={brand.mark} opacity={GLASS} />
        <Path d={BOTTOM_BULB} fill={brand.mark} opacity={GLASS} />
        <AnimatedRect x={17.5} width={21} fill={brand.mark} clipPath={`url(#${id}top)`} animatedProps={topSand} />
        <AnimatedRect x={17.5} width={21} fill={brand.mark} clipPath={`url(#${id}bottom)`} animatedProps={bottomSand} />
        <AnimatedLine
          x1={28}
          x2={28}
          y1={28}
          stroke={brand.mark}
          strokeWidth={1.4}
          strokeLinecap="round"
          animatedProps={stream}
        />
        <Line x1={14} x2={42} y1={11.375} y2={11.375} stroke={brand.mark} strokeWidth={3.0625} strokeLinecap="round" />
        <Line x1={14} x2={42} y1={44.625} y2={44.625} stroke={brand.mark} strokeWidth={3.0625} strokeLinecap="round" />
        <Circle cx={28} cy={28.875} r={2.1} fill={brand.mark} />
      </Svg>
    </Animated.View>
  );
}

export { AnimatedHourglass };
