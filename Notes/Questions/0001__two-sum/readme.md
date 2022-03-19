# Problem Statement

<p>Given an array of integers <code>nums</code>&nbsp;and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>

<p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the <em>same</em> element twice.</p>

<p>You can return the answer in any order.</p>

<p>&nbsp;</p>
<p><strong>Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [2,7,11,15], target = 9
<strong>Output:</strong> [0,1]
<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
</pre>

<p><strong>Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [3,2,4], target = 6
<strong>Output:</strong> [1,2]
</pre>

<p><strong>Example 3:</strong></p>

<pre>
<strong>Input:</strong> nums = [3,3], target = 6
<strong>Output:</strong> [0,1]
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
	<li><strong>Only one valid answer exists.</strong></li>
</ul>

<p>&nbsp;</p>
<strong>Follow-up:&nbsp;</strong>Can you come up with an algorithm that is less than&nbsp;<code>O(n<sup>2</sup>)&nbsp;</code>time complexity?

# Solution

A naive <code>O(n<sup>2</sup>)</code> solution is simple. 
```typescript
function twoSum(nums, target) {
    for a in nums
        for b in nums
            if a != b && a + b == target
                return [a, b]
    return []
}
```

<!-- To reduce the time complexity, 
we may use the hash-map lookup approach. -->

Notice that `a + b == target` is equivalent to `a = target - b`, and each side of the equality represents 1 degree of complexity. Hence, to reduce the time complexity as required, we may lower the complexity on any one side.

And in terms of programming, it is to turn a linear-scan into a constant lookup, which can be best achieved by the hashmap-lookup approach.

```typescript
memo = Set()
for b in nums
    memo.set(target - b, ...)
```

Another key to the question 
is to ensure that the result pair comes from two different array indices, which means we may want to store the corresponding array item index as lookup table value.

```typescript
memo = Set()
for index_b from 0 to nums.length - 1
    memo.set(target - b, index_b)
```

Since `a = target - b`, if `memo[a]` exists,
then `memo[a] = memo[target - b] = index_b`

Hence the full program can be rewritten as below.

```typescript
function twoSum(nums, target) {
    memo = Set()
    for index_b from 0 to nums.length - 1
        memo.set(target - b, index_b)

    for index_a from 0 to nums.length - 1
        a = nums[index_a]
        if not memo.has(a)
            continue
        index_b = memo[a]
        if index_a != index_b
            return [index_a, index_b]
    return []
}
```

See [this file](./solution-1.cpp) for a C++ solution.

To sum up, by hashmap-lookup approach, 
we successfully span the original <code>O(n<sup>2</sup>)</code> time complexity into <code>O(n)</code> time complexity + <code>O(n)</code> space complexity.
