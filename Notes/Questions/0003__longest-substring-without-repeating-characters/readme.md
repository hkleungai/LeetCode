# Problem Statement

<p>Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>

<p>&nbsp;</p>
<p><strong>Example 1:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;abcabcbb&quot;
<strong>Output:</strong> 3
<strong>Explanation:</strong> The answer is &quot;abc&quot;, with the length of 3.
</pre>

<p><strong>Example 2:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;bbbbb&quot;
<strong>Output:</strong> 1
<strong>Explanation:</strong> The answer is &quot;b&quot;, with the length of 1.
</pre>

<p><strong>Example 3:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;pwwkew&quot;
<strong>Output:</strong> 3
<strong>Explanation:</strong> The answer is &quot;wke&quot;, with the length of 3.
Notice that the answer must be a substring, &quot;pwke&quot; is a subsequence and not a substring.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>0 &lt;= s.length &lt;= 5 * 10<sup>4</sup></code></li>
	<li><code>s</code> consists of English letters, digits, symbols and spaces.</li>
</ul>

# Solution

## Default Cases

Consider that for small `s.length`, we already know the answer without further computation.
- For `s.length = 0`, the answer is 0 since no substring can be drawn.
- For `s.length = 1`, the answer is 1 the only substring that can be drawn is `s` itself. 
By default length-1 string contains unique character.
```typescript
if (s.length == 0)
    return 0
if (s.length == 1)
    return 1
```

## General Idea
One intuitive solution is to incrementally build unique substring at each array index, and pick the largest length among them.

```typescript
function lengthOfLongestSubstring(s) {
    // Default returns
    // ...

    result = 0
    for array_index from 0 to s.length - 1 
        substring = get_max_substring(s, array_index)

        if substring.length > result
            result = substring.length
    return result
}
```


Consider example 1 with `s = "abcabcbb"`.
- We wish to construct the largest substring with all unique characters at array index 0.
    - At array index 0, we meet `'a'` at <code>s = "<ins>a</ins>bcabcbb"</code>.
    Then we build `substring = "a"`.
    - At array index 1, we meet `'b'` at <code>s = "a<ins>b</ins>cabcbb"</code>. 
    Since `substring` _does not contains_ `'b'`,
    we add `b` to `substring` to form `substring = "ab"`.
    - At array index 2, we meet `'c'` at <code>s = "ab<ins>c</ins>abcbb"</code>. 
    Since `substring` _does not contains_ `'c'`,
    we add `c` to `substring` to form `substring = "abc"`.
    - At array index 3, we meet `'a'` at at <code>s = "abc<ins>a</ins>bcbb"</code>. 
    Since `substring` _contains_ `'c'`,
    we stop, and denote the largest substring with all unique characters at array index 0 to be `"abc"` with size 3.
- We then construct the largest substring with all unique characters at array index 1.
- And so on.

Hence we have 
```typescript
function get_max_substring(s, array_index) {    
    result = ""
    for possible_length from 1 to s.length {
        // Proceed by 0-based
        char = s[array_index + possible_length - 1]
        if have seen char in result
            break
        else
            result.append(c)
    }
    return result
}
```

## Optimization

The question is asking about length, 
not the actual string content in such optimal substring.
Hence we can simply return the found length to save memory

Moreover, we may acquire hashmap-lookup approach
for implementing the "have-seen" logic,
instead of relying things like `string.find()`.
Since the test input may include not only letters and numbers, but also certain "symbols",
we may want to acquire an ordered length-128 boolean array.

```diff
- function get_max_substring(s, array_index) {
+ function get_max_substring_length(s, array_index) {
-   result = ""
+   result = 0
+   seen[128] = Array(128).fill(false)
    for possible_length from 1 to s.length {
        // Proceed by 0-based
        char = s[array_index + possible_length - 1]
        if seen[char - '\0']
+           result = possible_length
            break
        else
-           result.append(c)
+           seen[char - '\0'] = true
-     }
    return result
}
```

We may also precompute how many unique character `s` has originally.

```typescript
has_char[128] = Array(128).fill(false)
for char in s
    has_char[char - '\0'] = true

unique_count = 0
for ascii_index from 0 to 127
    if (has_char[ascii_index]) 
        unique_count++
```

In this way we can faxilitate few early exits.


```diff
function lengthOfLongestSubstring(s) {
    // Default returns
    // ...

+   // compute unique_count
+   // ...
+
+   if (unique_count == s.length) 
+       return unique_count
+
    result = 0
    for array_index from 0 to s.length - 1 
        substring_length = get_max_substring_length(s, array_index)

+       if (unique_count == substring_length) 
+           return unique_count
+
        if substring_length > result
           result = substring_length
    return result
}
```

## Summary

The full program can be written as below.
```typescript
function get_max_substring_length(s, array_index) {
    result = 0
    seen[128] = Array(128).fill(false)
    for possible_length from 1 to s.length {
        // Proceed by 0-based
        char = s[array_index + possible_length - 1]
        if seen[char - '\0']
            result = possible_length
            break
        else
            seen[char - '\0'] = true
    return result
}

function lengthOfLongestSubstring(s) {
    if (s.length == 0)
        return 0
    if (s.length == 1)
        return 1

    has_char[128] = Array(128).fill(false)
    for char in s
        has_char[char - '\0'] = true

    unique_count = 0
    for ascii_index from 0 to 127
        if (has_char[ascii_index]) 
            unique_count++

    if (unique_count == s.length) 
        return unique_count
 
    result = 0
    for array_index from 0 to s.length - 1 
        substring_length = get_max_substring_length(s, array_index)

        if (unique_count == substring_length) 
            return unique_count

        if substring_length > result
           result = substring_length
    return result
}
```

See [this file](./solution-1.cpp) for a C++ solution.

To sum up, by using hashmap-lookup approach, 
we efficiently compute the maximum length of 
non-repeating substrings at each array index,
and hence obtain the desired global maximum of such lengths.
