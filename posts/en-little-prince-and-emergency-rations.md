---
title: "The Little Prince and the Emergency Rations"
date: "2024-05-18"
tags: ["PS", "Algorithm", "C++"]
lang: "en"
author: "Dohan Kwon"
description: "An original algorithm problem and its solution."
---

To prepare emergency rations for his upcoming journey, the Little Prince planted an apple tree on Asteroid B612. The height of the apple tree is 10m, and all apples are assumed to grow at the very top of the tree (at the 10m mark).

As soon as an apple is fully grown, it begins to fall. The falling speed is 20m per day. Therefore, it takes 12 hours for an apple to reach the ground. The Little Prince can collect the apple the moment it touches the ground.

The process of an apple being created is as follows:

1.  It takes 1 hour for a bud to form on a branch.
2.  It takes an additional 4 hours for that bud to grow into a ripened apple. (In other words, it takes a total of 5 hours from the moment a branch exists for an apple to begin falling.)
3.  Once the apple falls and is harvested, the branch it was attached to disappears.

Additionally, the moment an apple reaches the ground, one new bud and one new branch are simultaneously created on the tree.

At the start, there is 1 branch and 1 bud already on the tree. After 1 hour, one additional branch is created.

Find the total time required for the Little Prince to collect $n$ apples.

---

## Input

The first line contains the number of test cases, $T$

The following $T$ lines each contain an integer **$n$**, the number of apples to be collected.

## Output

For each test case, output the total time (in hours) required to collect $n$ apples on a new line.

## Example Input 1

```plaintext
16
1
2
3
4
6
8
9
10
13
17
20
21
24
31
38
41
```

## Example Output 1

```plaintext
16
17
18
32
33
34
35
48
49
50
51
52
65
66
67
68
```

---

# Solution

```cpp
#include <iostream>
#include <vector>

int main() {
    int T;
    std::cin >> T;

    while(T--) {
        int n;
        std::cin >> n;
        std::vector<int> apple;
        apple.push_back(0);
        int sum = 0, time = 0;

        while(sum < n) {
            time++;
            for(int i = sum; i < apple.size(); i++) {
                apple[i]++;
                // 16 hours: 4h growth + 12h falling
                if(apple[i] == 16) {
                    sum++;
                    apple.push_back(-1); // New bud
                    apple.push_back(-2); // New branch
                }
            }
            if(time == 1 || time == 2) apple.insert(apple.begin() + time, 0);
        }

        std::cout << time << std::endl;
    }
    return 0;
}
```
