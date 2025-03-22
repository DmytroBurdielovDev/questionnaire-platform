export class AppError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(404, message);
    }
}