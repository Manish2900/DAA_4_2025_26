class Solution {
  public:
    vector<int> maxOfSubarrays(vector<int>& arr, int k) {
        int n = arr.size();
        
        vector<int> output;
        priority_queue<pair<int, int>> pq;
        
        for(int i=0; i<k; i++){
            pq.push({arr[i], i});
        }
        output.push_back(pq.top().first);
        
        for(int i=k; i<n; i++){
            pq.push({arr[i], i});
            while(pq.top().second <= i-k){
                pq.pop();
            }
            output.push_back(pq.top().first);
        }
        
        return output;
    }
};