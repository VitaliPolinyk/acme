export interface IRepository<T> {
    create(entity: T): Promise<T>;
    update(entityId: number, entity: Partial<T>): Promise<void>;
    save?(entity: T, update: Partial<T>): Promise<void>;
    getById(entityId: number): Promise<T>;
    findOne(criteria: any, options?: any): Promise<T>;
    find(criteria: any): Promise<T[]>;
    getAll(): Promise<T[]>;
    remove(entityId: number): Promise<void>;
}