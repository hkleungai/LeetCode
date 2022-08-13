# Problem Statement

<p>You are given the strings <code>key</code> and <code>message</code>, which represent a cipher key and a secret message, respectively. The steps to decode <code>message</code> are as follows:</p>

<ol>
	<li>Use the <strong>first</strong> appearance of all 26 lowercase English letters in <code>key</code> as the <strong>order</strong> of the substitution table.</li>
	<li>Align the substitution table with the regular English alphabet.</li>
	<li>Each letter in <code>message</code> is then <strong>substituted</strong> using the table.</li>
	<li>Spaces <code>&#39; &#39;</code> are transformed to themselves.</li>
</ol>

<ul>
	<li>For example, given <code>key = &quot;<ins><strong>hap</strong></ins>p<ins><strong>y</strong></ins> <ins><strong>bo</strong></ins>y&quot;</code> (actual key would have <strong>at least one</strong> instance of each letter in the alphabet), we have the partial substitution table of (<code>&#39;h&#39; -&gt; &#39;a&#39;</code>, <code>&#39;a&#39; -&gt; &#39;b&#39;</code>, <code>&#39;p&#39; -&gt; &#39;c&#39;</code>, <code>&#39;y&#39; -&gt; &#39;d&#39;</code>, <code>&#39;b&#39; -&gt; &#39;e&#39;</code>, <code>&#39;o&#39; -&gt; &#39;f&#39;</code>).</li>
</ul>

<p>Return <em>the decoded message</em>.</p>

<p>&nbsp;</p>
<p><strong>Example 1:</strong></p>
<img alt="" src="ex1new4.jpg" style="width: 752px; height: 150px;" />
<pre>
<strong>Input:</strong> key = &quot;the quick brown fox jumps over the lazy dog&quot;, message = &quot;vkbs bs t suepuv&quot;
<strong>Output:</strong> &quot;this is a secret&quot;
<strong>Explanation:</strong> The diagram above shows the substitution table.
It is obtained by taking the first appearance of each letter in &quot;<ins><strong>the</strong></ins> <ins><strong>quick</strong></ins> <ins><strong>brown</strong></ins> <ins><strong>f</strong></ins>o<ins><strong>x</strong></ins> <ins><strong>j</strong></ins>u<ins><strong>mps</strong></ins> o<ins><strong>v</strong></ins>er the <ins><strong>lazy</strong></ins> <ins><strong>d</strong></ins>o<ins><strong>g</strong></ins>&quot;.
</pre>

<p><strong>Example 2:</strong></p>
<img alt="" src="ex2new.jpg" style="width: 754px; height: 150px;" />
<pre>
<strong>Input:</strong> key = &quot;eljuxhpwnyrdgtqkviszcfmabo&quot;, message = &quot;zwx hnfx lqantp mnoeius ycgk vcnjrdb&quot;
<strong>Output:</strong> &quot;the five boxing wizards jump quickly&quot;
<strong>Explanation:</strong> The diagram above shows the substitution table.
It is obtained by taking the first appearance of each letter in &quot;<ins><strong>eljuxhpwnyrdgtqkviszcfmabo</strong></ins>&quot;.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>26 &lt;= key.length &lt;= 2000</code></li>
	<li><code>key</code> consists of lowercase English letters and <code>&#39; &#39;</code>.</li>
	<li><code>key</code> contains every letter in the English alphabet (<code>&#39;a&#39;</code> to <code>&#39;z&#39;</code>) <strong>at least once</strong>.</li>
	<li><code>1 &lt;= message.length &lt;= 2000</code></li>
	<li><code>message</code> consists of lowercase English letters and <code>&#39; &#39;</code>.</li>
</ul>
