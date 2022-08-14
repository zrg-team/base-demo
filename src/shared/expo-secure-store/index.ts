import * as SecureStore from "expo-secure-store";

class SecureStorage {
  service?: string = "_SECURE_SERVICE_";

  async setValue(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value, {
        keychainService: this.service,
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  async getValue(key: string) {
    try {
      const result = await SecureStore.getItemAsync(key, {
        keychainService: this.service,
      });
      return result;
    } catch (err) {
      return null;
    }
  }

  async deleteValue(key: string) {
    try {
      await SecureStore.deleteItemAsync(key, {
        keychainService: this.service,
      });
      return true;
    } catch (err) {
      return false;
    }
  }
}

export default new SecureStorage();
