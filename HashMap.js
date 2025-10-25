class HashMap {
  #buckets;
  #loadFactor;
  #capacity;

  constructor(capacity = 16, loadFactor = 0.75) {
    this.#buckets = [];
  }
  /*
    takes two arguments: the first is a key, and the second is a value that is assigned to this key.
    If a key already exists, then the old value is overwritten, and we can say that we update the key’s value.

    (e.g. Carlos is our key but it is called twice: once with value I am the old value.,
    and once with value I am the new value.. Following this logic, Carlos should contain only the latter value).
  */
  set(key, value) {}

  //takes one argument as a key and returns the value that is assigned to this key. If a key is not found, return null.
  get(key) {}

  //takes a key as an argument and returns true or false based on whether or not the key is in the hash map.
  has(key) {}
  //takes a key as an argument. If the given key is in the hash map, it should remove the entry with that key and return true. If the key isn’t in the hash map, it should return false.
  remove(key) {}
  //returns the number of stored keys in the hash map.
  length() {}
  // removes all entries in the hash map.
  clear() {}
  //returns an array containing all the keys inside the hash map.
  keys() {}
  //returns an array containing all the values.
  values() {}
  //returns an array that contains each key, value pair. Example: [[firstKey, firstValue], [secondKey, secondValue]]
  entries() {}

  //MurmurHash3 courtesy of chatGPT
  hash(key) {
    let h1 = 0;
    let c1 = 0xcc9e2d51;
    let c2 = 0x1b873593;
    let i = 0;
    const len = key.length;
    const roundedEnd = len & ~0x3;

    for (; i < roundedEnd; i += 4) {
      let k1 =
        (key.charCodeAt(i) & 0xff) |
        ((key.charCodeAt(i + 1) & 0xff) << 8) |
        ((key.charCodeAt(i + 2) & 0xff) << 16) |
        ((key.charCodeAt(i + 3) & 0xff) << 24);

      k1 = Math.imul(k1, c1);
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = Math.imul(k1, c2);

      h1 ^= k1;
      h1 = (h1 << 13) | (h1 >>> 19);
      h1 = Math.imul(h1, 5) + 0xe6546b64;
    }

    let k1 = 0;
    switch (len & 3) {
      case 3:
        k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
      case 2:
        k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
      case 1:
        k1 ^= key.charCodeAt(i) & 0xff;
        k1 = Math.imul(k1, c1);
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = Math.imul(k1, c2);
        h1 ^= k1;
    }

    h1 ^= len;
    h1 ^= h1 >>> 16;
    h1 = Math.imul(h1, 0x85ebca6b);
    h1 ^= h1 >>> 13;
    h1 = Math.imul(h1, 0xc2b2ae35);
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
  }
}
