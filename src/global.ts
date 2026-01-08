export type CategoryKey = "food" | "transport" | "entertainment" | "travel" | "other";

export interface Category {
    key: CategoryKey;
    label: string;
    color: string;
};

export interface Expense {
    id: number;
    expenseName: string;
    amount: number;
    expenseType: CategoryKey;
};