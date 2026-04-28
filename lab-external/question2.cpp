#include<bits/stdc++.h>
using namespace std;

struct node{
    int data;
    node* next;

    node(int value){
        data = value;
        next = nullptr;
    }
};

void push(node* &head, int data){
    if(head == nullptr){
        head = new node(data);
        return;
    }

    if(head->next == nullptr){
        head->next = new node(data);
        return;
    }

    node* temp = head;
    while(temp->next != nullptr) temp = temp->next;

    temp->next = new node(data);
}

void pop(node* &head){
    if(head == nullptr){
        cout << "list is empty";
        return;
    }

    if(head->next == nullptr){
        node* temp = head;
        head = nullptr;
        delete temp;
        return;
    }

    node* temp = head;
    head = head->next;
    delete temp;
}

bool isEmpty(node* head){
    if(head == nullptr) return true;
    else return false;
}

int peek(node* head){
    if(head == nullptr){
        return -1;
    }

    return head->data;
}

int size(node* head){
    if(head == nullptr) return 0;

    int count = 1;
    node* temp = head;
    while(temp->next != nullptr){
        temp = temp->next;
        count++;
    }

    return count;
}