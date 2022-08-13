#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int sum) {
        unordered_map<int, int> memo;
        for (int i = 0; i < nums.size(); i++)
            memo[sum - nums[i]] = i;
        for (int i = 0; i < nums.size(); i++) {
            if (memo.find(nums[i]) == memo.end())
                continue;
            int j = memo[nums[i]];
            if (i != j) {
                return { i, j };
            }
        }
        return vector<int>();
    }
};
