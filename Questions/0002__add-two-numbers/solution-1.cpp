#include <algorithm>
using namespace std;

// This definition is uncommented to suppress compiler warning.
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        if (!l1 && !l2)
            return nullptr;
        if (!l1)
            swap(l1, l2);
        l2 && (l1->val += l2->val);
        if (l1->val / 10) {
            !l1->next && (l1->next = new ListNode());
            l1->next->val += l1->val / 10;
            l1->val %= 10;
        }
        l1->next = addTwoNumbers(l1->next, l2 ? l2->next : nullptr);
        return l1;
    }
};
