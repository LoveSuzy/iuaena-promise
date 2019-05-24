const PENDING = 0;
const FULFILL = 1;
const REJECT = 2;

function Pro(fn, name) {
  this.status = PENDING;
  this.val = undefined;
  this.reason = undefined;
  this.name = name;
  const resolve = (val) => {
    if (typeof val === 'object' && val.then) { 
      val.then(nextValue => {
        this.val = nextValue;
        this.status = FULFILL;
        check();
      })
    } else {
      this.status = FULFILL;
      this.val = val;
      check();
    }
  }
  const check = () => {
    if (this.nextResolve) {
      const nextVal = this.nextFn(this.val);
      this.nextResolve(nextVal);
    }
  }
  setTimeout(() => {
    fn(resolve);
  }, 0);
}

Pro.prototype.then = function(fn) {
  const self = this;
  return new Pro((resolve, reject) => {
    if (self.status === PENDING) {
      self.nextResolve = resolve;
      self.nextFn = fn;
    } else if (self.status === FULFILL) {
      const nextVal = fn(self.val);
      resolve(nextVal);
    }
  });
}

const p = new Pro((resolve, reject) => {
  setTimeout(() => {
    resolve(2);
  }, 500);
}, 'p1')

const p2 = new Pro(resolve => {
  resolve(10);
})

const p3 = p.then(val => {
  console.log(val);
  return val + 1;
}).then(val => {
  console.log(val);
  return p2
}).then(val => {
  console.log(10)
  return val + 1;
})

p3.then(val => {
  console.log(val);
})
