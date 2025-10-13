export declare class ErrorResponseSchema {
    statusCode: number;
    message: string;
    error: string;
}
export declare class UnauthorizedResponseSchema {
    statusCode: number;
    message: string;
}
export declare class ForbiddenResponseSchema {
    statusCode: number;
    message: string;
}
export declare class NotFoundResponseSchema {
    statusCode: number;
    message: string;
}
export declare class PaginationSchema {
    page: number;
    limit: number;
    total: number;
}
export declare class SuccessMessageSchema {
    message: string;
}
export declare class MaterialSchema {
    id: number;
    name: string;
    code?: string;
    unit: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}
export declare class CategorySchema {
    id: number;
    name: string;
    description?: string;
}
export declare class UserSchema {
    id: number;
    username: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}
export declare class MaterialHistorySchema {
    id: number;
    fieldChanged: string;
    oldValue: string;
    newValue: string;
    changedBy: string;
    changedAt: string;
}
