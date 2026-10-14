import Constants from 'expo-constants';
import { randomUUID } from 'expo-crypto';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { Device as DeviceInfo } from '@/services/types';

const INSTALLATION_KEY = 'device.installation_id';

// A random id made on first use and kept, so the server sees one device per install across sign-ins.
async function getInstallationId() {
  let id = await SecureStore.getItemAsync(INSTALLATION_KEY);
  if (!id) {
    id = randomUUID();
    await SecureStore.setItemAsync(INSTALLATION_KEY, id);
  }
  return id;
}

// What the server records about this device at sign-in.
async function getDeviceInfo(): Promise<DeviceInfo> {
  return {
    platform: Platform.OS === 'ios' ? 'ios' : 'android',
    installation_id: await getInstallationId(),
    device_name: Device.deviceName ?? undefined,
    app_version: Constants.expoConfig?.version,
    os_version: Device.osVersion ?? undefined,
  };
}

export { getDeviceInfo };
