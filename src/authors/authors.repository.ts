import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "authors"})
export class Author{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    firstName: string;

    @Column({nullable: false})
    lastName: string;

    @Column({nullable: true})
    bio: string;

    @Column({nullable: true})
    birthDate: Date;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamptz"})
    updatedAt: Date;

}

export type AuthorType = {
    firstName: string,
    lastName: string,
    bio: string,
    birthDate: Date
}