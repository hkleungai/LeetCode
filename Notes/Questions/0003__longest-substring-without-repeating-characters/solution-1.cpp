#include <string>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        if (s.size() < 2)
            return s.size();

        bool has_char[128] = {};
        for (char& c: s)
            has_char[c] = true;

        int res_bound = 0;
        for (int i = 0; i < 128; i++)
            has_char[i] && res_bound++;

        if (res_bound == s.size())
            return res_bound;

        int res = 0;
        for (int char_id = 0; char_id < s.size(); char_id++) {
            bool seen_char[128] = {};
            int curr_res = 0;
            for (; char_id + curr_res < s.size() && !seen_char[s[char_id + curr_res]]; curr_res++)
                seen_char[s[char_id + curr_res]] = true;
            if (curr_res == res_bound)
                return curr_res;
            res < curr_res && (res = curr_res);
        }
        return res;
    }
};
