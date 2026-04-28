#include<bits/stdc++.h>
using namespace std;

int LIS(vector<int> arr){
    int n = arr.size();
    int answer = 0;

    for(int i=0; i<n-1; i++){
        int temp = arr[i];
        int count = 1;
        
        for(int j=i+1; j<n; j++){
            if(arr[j] > temp){
                count++;
                temp = arr[j];
            }
        }

        answer = max(answer, count);
    }

    return answer;
}