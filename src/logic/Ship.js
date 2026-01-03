const Ship = (length) => {
  let hits = 0;

  const hit = () => {
    if (hits < length) {
      hits += 1;
    }
  };

  const getHits = () => hits;

  const isSunk = () => hits >= length;

  return {
    length,
    getHits,
    hit,
    isSunk,
  };
};

export default Ship;