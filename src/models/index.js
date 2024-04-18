// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const NotificationMessageType = {
  "COMMON": "COMMON",
  "PAYMENT": "PAYMENT"
};

const UserRole = {
  "MEMBER": "MEMBER",
  "COACH": "COACH",
  "ADMIN": "ADMIN"
};

const UserStatus = {
  "ACTIVE": "ACTIVE",
  "INACTIVE": "INACTIVE"
};

const CategoryDetailBodyType = {
  "UPPER": "UPPER",
  "LOWER": "LOWER",
  "FULL": "FULL"
};

const CategoryDetailType = {
  "BEGINNER": "BEGINNER",
  "INTERMEDIATE": "INTERMEDIATE",
  "ADVANCE": "ADVANCE"
};

const { Todo, MutationPayment, PaymentIntent, Notification, User, BookSession, Message, ChatRoom, Rating, Banner, CategoryDetail, Category } = initSchema(schema);

export {
  Todo,
  MutationPayment,
  PaymentIntent,
  Notification,
  User,
  BookSession,
  Message,
  ChatRoom,
  Rating,
  Banner,
  CategoryDetail,
  Category,
  NotificationMessageType,
  UserRole,
  UserStatus,
  CategoryDetailBodyType,
  CategoryDetailType
};