# Problem Statement

<p>You are given an integer array <code>nums</code>. The adjacent integers in <code>nums</code> will perform the float division.</p>

<ul>
	<li>For example, for <code>nums = [2,3,4]</code>, we will evaluate the expression <code>&quot;2/3/4&quot;</code>.</li>
</ul>

<p>However, you can add any number of parenthesis at any position to change the priority of operations. You want to add these parentheses such the value of the expression after the evaluation is maximum.</p>

<p>Return <em>the corresponding expression that has the maximum value in string format</em>.</p>

<p><strong>Note:</strong> your expression should not contain redundant parenthesis.</p>

<p>&nbsp;</p>
<p><strong>Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [1000,100,10,2]
<strong>Output:</strong> &quot;1000/(100/10/2)&quot;
<strong>Explanation:</strong>
1000/(100/10/2) = 1000/((100/10)/2) = 200
However, the bold parenthesis in &quot;1000/((100/10)/2)&quot; are redundant, since they don&#39;t influence the operation priority. So you should return &quot;1000/(100/10/2)&quot;.
Other cases:
1000/(100/10)/2 = 50
1000/(100/(10/2)) = 50
1000/100/10/2 = 0.5
1000/100/(10/2) = 2
</pre>

<p><strong>Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [2,3,4]
<strong>Output:</strong> &quot;2/(3/4)&quot;
</pre>

<p><strong>Example 3:</strong></p>

<pre>
<strong>Input:</strong> nums = [2]
<strong>Output:</strong> &quot;2&quot;
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 10</code></li>
	<li><code>2 &lt;= nums[i] &lt;= 1000</code></li>
	<li>There is only one optimal division for the given iput.</li>
</ul>