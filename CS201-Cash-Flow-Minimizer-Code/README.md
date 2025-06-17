# Cash Flow Minimizer

The **Cash Flow Minimizer** is a C program designed to simplify expense management within a group. It keeps track of individual expenses, calculates outstanding balances among group members, and suggests the minimum number of transactions needed to settle all debts.

---
## Team Details
- Aksh Sihag(2023CSB1097)
- Mayank(2023MCB1301)
- Pratyush(2023MCB1310)

## Table of Contents
- [Features](#features)
- [Installation and Compilation](#installation-and-compilation)
- [Usage Instructions](#usage-instructions)
- [Program Menu Options](#program-menu-options)
- [Description](#description)
- [Example Output](#example-output)

---

## Features
- **Add Users**: Easily add group members with unique IDs.
- **Record Expenses**: Enter expense details, including amount, payer, and participants, to adjust balances.
- **Balance Display**: View the current balance of each group member.
- **Minimize Transactions**: Uses a greedy algorithm to compute the minimum transactions required for debt settlement within the group.

---

## Installation and Compilation

### Compiling the Code
To compile the source code, use the following command in your terminal:

```bash
gcc code.c -o code
```
Run the executable with the following command:
```bash
./code
```

## Usage Instructions

1. **Add User:**
   - Select the "Add User" option, and enter the name of the new user. Each user will be assigned a unique ID with an initial balance of zero.

2. **Add Expense:**
   - Select the "Add Expense" option and specify the expense details in the following format:
     ```
     <Description> <AmountPaid> <PayerID> <NumberOfParticipants> <ParticipantIDs>
     ```
   - Example: 
     ```
     Dinner 120.00 2 3 1 2 3
     ```
     This logs a dinner expense of Rs.120 paid by user ID 2, split among users with IDs 1, 2, and 3.

3. **Print Balances:**
   - Choose the "Print Balances" option to display each user's current balance within the group.

4. **Minimize Cash Flow:**
   - This option calculates the minimum transactions needed to clear all outstanding debts in the group, providing a list of suggested transactions for complete settlement.

5. **Exit:**
   - Choose the "Exit" option to save group data and exit the program.

## Program Menu Options

![Program Menu Options](https://github.com/user-attachments/assets/dbf14b7d-6516-4e4f-8c19-dfc6be24ba1f)

This image shows the program menu options available for the Cash Flow Minimizer.

## Description

![Description](https://github.com/user-attachments/assets/2b5f00d3-c778-46b0-9912-a06f94cf1720)

This image illustrates the program's ability to minimize the number of transactions required to settle debts among group members. By leveraging a greedy algorithm, the Cash Flow Minimizer intelligently evaluates each user's outstanding balance and strategically pairs creditors and debtors to facilitate efficient settlements.

The algorithm prioritizes transactions that reduce the overall number of payments, allowing users to settle their debts in the simplest manner possible. For instance, if one user owes another, the program calculates the optimal amount to transfer, ensuring that both parties' balances are updated effectively.


## Example Output

![Example Output](https://github.com/user-attachments/assets/c05e56f4-cac0-4f86-a3e7-1e748d8b5202)
This image shows the output given by the Cash Flow Minimizer for the provided input.


