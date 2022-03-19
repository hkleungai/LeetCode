# Problem Statement

<p>You are given two <strong>non-empty</strong> linked lists representing two non-negative integers. The digits are stored in <strong>reverse order</strong>, and each of their nodes contains a single digit. Add the two numbers and return the sum&nbsp;as a linked list.</p>

<p>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>

<p>&nbsp;</p>
<p><strong>Example 1:</strong></p>
<img alt="" src="addtwonumber1.jpg" style="width: 483px; height: 342px;" />
<pre>
<strong>Input:</strong> l1 = [2,4,3], l2 = [5,6,4]
<strong>Output:</strong> [7,0,8]
<strong>Explanation:</strong> 342 + 465 = 807.
</pre>

<p><strong>Example 2:</strong></p>

<pre>
<strong>Input:</strong> l1 = [0], l2 = [0]
<strong>Output:</strong> [0]
</pre>

<p><strong>Example 3:</strong></p>

<pre>
<strong>Input:</strong> l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
<strong>Output:</strong> [8,9,9,9,0,0,0,1]
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li>The number of nodes in each linked list is in the range <code>[1, 100]</code>.</li>
	<li><code>0 &lt;= Node.val &lt;= 9</code></li>
	<li>It is guaranteed that the list represents a number that does not have leading zeros.</li>
</ul>

# Solution

From the example diagrams, we may infer two different sum approaches, namely _horizontal-sum_ and _vertical-sum_.

Applying _horizontal-sum_ approach means that 
1. Sum each linked-list individually
2. Sum the two resulting integer
3. Convert the result back into a linked-list.

From the question constraint, 
number of nodes can go up to 100, 
which means the actual integers these nodes represesnt 
may go up to <code>10<sup>100</sup></code>.
Since most langauges usually can only stored up to <code>2<sup>32</sup></code> bits for integers, _horizontal-sum_ approach is not practical in this question.

Applying _vertical-sum_ approach means that 
1. Sum nodes at the heads of the two lists to obtain place value and carry
2. Move heads for both lists to their next pointer, and continue.

This is more do-able, considering that linked-list favours linear scan one-after-another.

In programming level, 
to avoid complicate loop index management, 
we may want to implement the program in a recursive manner.

First thing is the terminate-condition.
```typescript
if (l1 == null and l2 == null) {
    return null;
}
```

Let's use `l1` as the returned value. 
In this case we only have to allocate 
some extra memory of size `|l1.length - l2.length|`.
On the other hand, creating a new list `l3` as the returned list would consume memory of size `max(l1.length, l2.length)`, which is not as satisfied as the first approach.

To make this approach error-free, we also need to prevent 
an edge case of having a nullish `l1`.

```typescript
if l1 == null and l2 == null
    return null;
if l1 == null
    swap l1 and l2 
...
return l1;
```

At each step of recursion,
we update the head of `l1` by `l2`'s head.
Here `l2` may be `null`, 
and we will have to guard for this case.
```typescript
if l2 != null
    l1.val += l2.val;
```

And then we process the carry.
```typescript
if l1.val >= 10
    create next pointer for l1 when none exist
    l1.next.val += 1 // as carry ... (1)
    l1.val %= 10 // as place-value ... (2)
```

At this point we have processed 
the head nodes for both lists. 
Then we recurse to process for the remaining lists.

_Notice that by (1), we keep pushing carry to `l1.next` at each step,
which may cause overflow to the next node.
So even `l2` can possibly be `null`,
we still need extra recursion steps to reach to (2) to ensure the resulting list is correct._ 

```typescript
l1.next = addTwoNumbers(l1.next, l2 == null ? null : l2.next)
```

Hence the full program can be written as below.
```typescript
function addTwoNumbers(l1, l2) {
    if l1 == null and l2 == null
        return null;

    if l1 == null
        swap l1 and l2 

    if l2 != null
        l1.val += l2.val;

    if l1.val >= 10
        create next pointer for l1 when none exist
        l1.next.val += 1 // as carry ... (1)
        l1.val %= 10 // as place-value ... (2)

    l1.next = addTwoNumbers(l1.next, l2 == null ? null : l2.next)

    return l1
}
```

See [this file](./solution-1.cpp) for a C++ solution.

To sum up, based on the linearity of 
linked-list data structure, we construct 
a vertical node-wise sum approach to perform addition for two integer-valued linked-lists.
