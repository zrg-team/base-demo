class SecureStorage {
  service?: string = '_SECURE_SERVICE_';

  async setValue(key: string, value: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await window.localStorage.setItem(key, value);
      return true;
    } catch (err) {
      return false;
    }
  }

  async getValue(key: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await window.localStorage.getItem(key);
      return result;
    } catch (err) {
      return null;
    }
  }

  async deleteValue(key: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await window.localStorage.removeItem(key);
      return true;
    } catch (err) {
      return false;
    }
  }
}

export default new SecureStorage();
