class MockApi {
  async updateStorageByKey({ key, value }: { key: string; value: any }) {
    return new Promise<void>(resolve => {
      localStorage.setItem(key, JSON.stringify(value))
      setTimeout(() => {
        resolve()
      }, 500)
    })
  }
}

export default MockApi
