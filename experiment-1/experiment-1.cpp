#include<iostream>
using namespace std;

const int MAX = 5;
int top = MAX-1;

int pop(int* stack){
    return stack[top--];
}

void push(int* stack, int val){
    if(top == -1){
        stack[++top] = val;
        return;
    }

    int temp = pop(stack);
    push(stack, val);
    stack[++top] = temp;
}

void reverseStack(int* stack){
    if(top == -1){
        return;
    }

    int val = pop(stack);
    reverseStack(stack);
    push(stack, val);
}

int main(){
    int stack[MAX];
    for(int i=0; i<MAX; i++){
        cin >> stack[i];
    }

    reverseStack(stack);

    for(int i=0; i<MAX; i++){
        cout << stack[i] << " ";
    }
}