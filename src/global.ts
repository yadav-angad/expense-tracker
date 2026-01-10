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
    createdDate: Date;
};

export interface GroupedExpenses {
    key: string; // date in MM-DD-YYYY format
    value: Expense[];
}

export const categories: Category[] = [
    { key: "food", label: "Food", color: "#f44336" },
    { key: "transport", label: "Transport", color: "#2196f3" },
    { key: "entertainment", label: "Entertainment", color: "#ff9800" },
    { key: "travel", label: "Travel", color: "#4caf50" },
    { key: "other", label: "Other", color: "#9c27b0" },
];