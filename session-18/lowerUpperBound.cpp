#include<bits/stdc++.h>
using namespace std;

int lowerBound(vector<int>& vec, int val){
    int n = vec.size();
    int st = 0, end = n - 1;
    int ans = n;  
    while (st <= end) {
        int mid = st + (end - st) / 2;
        if (vec[mid] >= val) {
            ans = mid;    
            end = mid - 1;  
        } else {
            st = mid + 1;   
        }
    }
    return ans;
}

int upperBound(vector<int>& vec, int val){
    int n = vec.size();
    int st = 0, end = n - 1;
    int ans = n;  
    while (st <= end) {
        int mid = st + (end - st) / 2;
        if (vec[mid] > val) {
            ans = mid;      
            end = mid - 1;  
        } else {
            st = mid + 1;   
        }
    }
    return ans;
}

int main(){
    int n;
    if (!(cin >> n)) return 0;

    vector<int> vec(n);
    for (int i = 0; i < n; ++i) cin >> vec[i];

    sort(vec.begin(), vec.end());

    int q;
    if (!(cin >> q)) return 0;

    while (q--) {
        int val; cin >> val;
        int lb = lowerBound(vec, val);
        int ub = upperBound(vec, val);
        cout << lb << " " << ub << " " << (ub - lb) << '\n';
    }

    return 0;
}