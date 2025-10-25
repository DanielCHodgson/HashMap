class HashMap {
  #buckets = [];
  #loadFactor;
  #minLoadFactor = 0.25;
  #capacity;
  #size = 0;

  constructor(capacity = 16, loadFactor = 0.75) {
    this.#capacity = capacity;
    this.#loadFactor = loadFactor;
    this.#initBuckets();
  }
  /*
    takes two arguments: the first is a key, and the second is a value that is assigned to this key.
    If a key already exists, then the old value is overwritten, and we can say that we update the key’s value.

    (e.g. Carlos is our key but it is called twice: once with value I am the old value.,
    and once with value I am the new value.. Following this logic, Carlos should contain only the latter value).
  */
  set(key, value) {
    const index = this.hash(key) % this.#capacity;
    this.#validateOutOfBounds(index);
    const bucket = this.#buckets[index];

    for (const entry of bucket) {
      if (entry.key === key) {
        entry.value = value;
        return;
      }
    }
    bucket.push({ key, value });
    this.#size++;
    this.#growIfOverLoadFactor();
  }

  //takes one argument as a key and returns the value that is assigned to this key. If a key is not found, return null.
  get(key) {
    const index = this.hash(key) % this.#capacity;
    this.#validateOutOfBounds(index);
    const bucket = this.#buckets[index];

    for (const entry of bucket) {
      if (entry.key === key) {
        return entry.value;
      }
    }
    return null;
  }

  //takes a key as an argument and returns true or false based on whether or not the key is in the hash map.
  has(key) {
    const index = this.hash(key) % this.#capacity;
    this.#validateOutOfBounds(index);
    const bucket = this.#buckets[index];

    for (const entry of bucket) {
      if (entry.key === key) {
        return true;
      }
    }
    return false;
  }
  //takes a key as an argument. If the given key is in the hash map, it should remove the entry with that key and return true. If the key isn’t in the hash map, it should return false.
  remove(key) {
    const index = this.hash(key) % this.#capacity;
    this.#validateOutOfBounds(index);
    const bucket = this.#buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        bucket.splice(i, 1);
        this.#size--;
        this.#shrinkIfBelowMinLoadFactor();
        return true;
      }
    }
    return false;
  }
  //returns the number of stored keys in the hash map.
  length() {
    return this.#size;
  }
  // removes all entries in the hash map.
  clear() {
    this.#buckets = [];
    this.#initBuckets();
    this.#size = 0;
  }
  //returns an array containing all the keys inside the hash map.
  keys() {
    return this.#buckets.flatMap((bucket) => bucket.map((entry) => entry.key));
  }
  //returns an array containing all the values.
  values() {
    return this.#buckets.flatMap((bucket) =>
      bucket.map((entry) => entry.value)
    );
  }
  //returns an array that contains each key, value pair. Example: [[firstKey, firstValue], [secondKey, secondValue]]
  entries() {
    return this.#buckets.flatMap((bucket) =>
      bucket.map((entry) => [entry.key, entry.value])
    );
  }

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

  #shrinkIfBelowMinLoadFactor() {
    if (this.#capacity <= 16 || this.#size === 0) return;

    if (this.#size / this.#capacity < this.#minLoadFactor) {
      const newCapacity = Math.max(Math.floor(this.#capacity / 2), 16);
      this.#resize(newCapacity);
    }
  }

  #growIfOverLoadFactor() {
    if (this.#size / this.#capacity > this.#loadFactor) {
      this.#resize(this.#capacity * 2);
    }
  }

  #resize(newCapacity) {
    const oldBuckets = this.#buckets;
    this.#capacity = newCapacity;
    this.#buckets = Array.from({ length: newCapacity }, () => []);

    for (const bucket of oldBuckets) {
      for (const entry of bucket) {
        const index = this.hash(entry.key) % newCapacity;
        this.#buckets[index].push(entry);
      }
    }
  }

  #initBuckets() {
    for (let i = 0; i < this.#capacity; i++) {
      this.#buckets.push([]);
    }
  }

  #validateOutOfBounds(index) {
    if (index < 0 || index >= this.#capacity) {
      throw new Error("Trying to access index out of bounds");
    }
  }

  getCapacity() {
    return this.#capacity;
  }

  getLoadFactor() {
    return this.#loadFactor;
  }
}

const test = new HashMap();

console.log(
  `
Created new HashMap 
Current capacity: ${test.getCapacity()}
Current loadfactor: ${test.getLoadFactor()}
Current size: ${test.length()}
`
);

test.set("apple", "red");
test.set("banana", "yellow");
test.set("carrot", "orange");
test.set("dog", "brown");
test.set("elephant", "gray");
test.set("frog", "green");
test.set("grape", "purple");
test.set("hat", "black");
test.set("ice cream", "white");
test.set("jacket", "blue");
test.set("kite", "pink");
test.set("lion", "golden");

console.log(
  `
Added: ${test.entries()}

Current load-level: ${test.length() / test.getCapacity()}
`
);

test.set("apple", "[overwritten red]");
test.set("banana", "[overwritten yellow]");
test.set("carrot", "[overwritten orange]");
test.set("dog", "[overwritten brown]");

console.log(
  `
Overwritten "apple", "banana", "carrot", "dog"
New entries:
${test.entries()}

Current load-level: ${test.length() / test.getCapacity()}
`
);

test.set("moon", "silver");

console.log(
  `
Added "moon, silver"
Current capacity: ${test.getCapacity()}
Current load-level: ${test.length() / test.getCapacity()}
`
);

test.set("frog", "[overwritten red]");
test.set("grape", "[overwritten yellow]");
test.set("hat", "[overwritten orange]");
test.set("ice cream", "[overwritten brown]");

console.log(
  `
Overwritten "frog", "grape", "hat", "ice cream"
New entries:
${test.entries()}

Current load-level: ${test.length() / test.getCapacity()}
`
);

console.log(`Has frog? ${test.has("frog")}`);
console.log(`Has ligma? ${test.has("ligma")}`);

test.remove("frog");

console.log(`
removed "frog"
Has frog? ${test.has("frog")};
`);

test.clear();

console.log(
`
Cleared hashmap. 
Capacity: ${test.getCapacity()}    
Length: ${test.length()}    
Entries: ${test.entries()}    
`
);
