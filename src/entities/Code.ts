import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('codes')
// @Unique(['email'])
export class Code {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  // @Column()
  // email!: string;

  // @CreateDateColumn()
  // createdAt!: Date;

  // @UpdateDateColumn({ nullable: true })
  // updatedAt: Date | null = null;
}
