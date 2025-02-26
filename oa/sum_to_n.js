
// Iterative Approach
// Time Complexity: O(n)
// Space Complexity: O(1)
const sum_to_n_a = (n) => {
  sum = 0
  for (let i = 1; i <= n; i++) { // Loop n times
    sum += i;
  }
  return sum
}

// Recursive Approach
// Time Complexity: O(n)
// Space Complexity: O(n)
const sum_to_n_b = (n) => {
  // your code here
  // Base case
  if (n == 1) {
    return 1;
  } 
  // Recursive Case
  // There will be n deferred operations, hence space complexity is n
  // This will be called n times, hence, causing time complexity to be n
  return n + sum_to_n_b(n - 1);
}

// Closed Form Approach
// Time Complexity: O(1)
// Space Complexity: O(1)
const sum_to_n_c = (n) => {
  // your code here
  return n * (n + 1) / 2;
}

// To help test, change z to any number
const z = 123;

console.log(sum_to_n_a(z))
console.log(sum_to_n_b(z))
console.log(sum_to_n_c(z))