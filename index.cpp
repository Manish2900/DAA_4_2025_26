#include <bits/stdc++.h>
using namespace std;
using namespace std::chrono;


int COUNT = 0;

void complexRec(int n) {


   if (n <= 2) {
       return;
   }


   int p = n;
   while (p > 0) {
       vector<int> temp(n);
       for (int i = 0; i < n; i++) {
           temp[i] = i ^ p;
           COUNT ++;
       }
       p >>= 1;
   }


   vector<int> small(n);
   for (int i = 0; i < n; i++) {
       small[i] = i * i;
       COUNT ++;
   }


   if (n % 3 == 0) {
       reverse(small.begin(), small.end());
   } else {
       reverse(small.begin(), small.end());
   }


   complexRec(n / 2);
   complexRec(n / 2);
   complexRec(n / 2);
}

int main(){
    int n;
    cin >> n;
    cout << "Input: " << n << endl;
    auto start = high_resolution_clock::now();
    complexRec(n);
    auto end = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(end - start);
    cout << "No. of operations: " <<  COUNT << endl;
    cout << "Execution Time (in milliseconds): " << duration.count();

    return 0;
}

// Recurrence Relation: T(n) = 3T(n/2) + (n^2)/logn + n
// Case 3, p<0 therefore Time Complexity: O(n^k) => O(n^2)