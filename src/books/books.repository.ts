import { Author } from 'src/authors/authors.repository';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum Genre {
  Fantasy,
  ScienceFiction,
  Thriller,
}

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  isbn: string;

  @Column({ nullable: true })
  publishedDate: Date;

  @Column({ enum: Genre })
  genre: Genre;

  @ManyToOne(() => Author, { onDelete: 'CASCADE' })
  @JoinColumn()
  author: Author;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

export type BookType = {
  title: string;
  isbn: string;
  publishedDate: string;
  genre: Genre;
  author: string;
};
