import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem, AsyncCollection } from "@aws-amplify/datastore";

export enum NotificationMessageType {
  COMMON = "COMMON",
  PAYMENT = "PAYMENT"
}

export enum UserRole {
  MEMBER = "MEMBER",
  COACH = "COACH",
  ADMIN = "ADMIN"
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export enum CategoryDetailBodyType {
  UPPER = "UPPER",
  LOWER = "LOWER",
  FULL = "FULL"
}

export enum CategoryDetailType {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCE = "ADVANCE"
}



type EagerTodo = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Todo, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTodo = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Todo, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Todo = LazyLoading extends LazyLoadingDisabled ? EagerTodo : LazyTodo

export declare const Todo: (new (init: ModelInit<Todo>) => Todo) & {
  copyOf(source: Todo, mutator: (draft: MutableModel<Todo>) => MutableModel<Todo> | void): Todo;
}

type EagerMutationPayment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MutationPayment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMutationPayment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MutationPayment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type MutationPayment = LazyLoading extends LazyLoadingDisabled ? EagerMutationPayment : LazyMutationPayment

export declare const MutationPayment: (new (init: ModelInit<MutationPayment>) => MutationPayment) & {
  copyOf(source: MutationPayment, mutator: (draft: MutableModel<MutationPayment>) => MutableModel<MutationPayment> | void): MutationPayment;
}

type EagerPaymentIntent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PaymentIntent, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly clientSecret: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPaymentIntent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PaymentIntent, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly clientSecret: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PaymentIntent = LazyLoading extends LazyLoadingDisabled ? EagerPaymentIntent : LazyPaymentIntent

export declare const PaymentIntent: (new (init: ModelInit<PaymentIntent>) => PaymentIntent) & {
  copyOf(source: PaymentIntent, mutator: (draft: MutableModel<PaymentIntent>) => MutableModel<PaymentIntent> | void): PaymentIntent;
}

type EagerNotification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Notification, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly url?: string | null;
  readonly from?: User | null;
  readonly to?: User | null;
  readonly title?: string | null;
  readonly message?: string | null;
  readonly messageType?: NotificationMessageType | keyof typeof NotificationMessageType | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly notificationFromId?: string | null;
  readonly notificationToId?: string | null;
}

type LazyNotification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Notification, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly url?: string | null;
  readonly from: AsyncItem<User | undefined>;
  readonly to: AsyncItem<User | undefined>;
  readonly title?: string | null;
  readonly message?: string | null;
  readonly messageType?: NotificationMessageType | keyof typeof NotificationMessageType | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly notificationFromId?: string | null;
  readonly notificationToId?: string | null;
}

export declare type Notification = LazyLoading extends LazyLoadingDisabled ? EagerNotification : LazyNotification

export declare const Notification: (new (init: ModelInit<Notification>) => Notification) & {
  copyOf(source: Notification, mutator: (draft: MutableModel<Notification>) => MutableModel<Notification> | void): Notification;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly username: string;
  readonly name?: string | null;
  readonly email: string;
  readonly image?: string | null;
  readonly age?: number | null;
  readonly bio?: string | null;
  readonly phone?: string | null;
  readonly address?: string | null;
  readonly country?: string | null;
  readonly state?: string | null;
  readonly city?: string | null;
  readonly category?: string | null;
  readonly working_radius?: string | null;
  readonly hourly_rate?: number | null;
  readonly cancellation_charge?: string | null;
  readonly primary_id?: string | null;
  readonly secondary_id?: string | null;
  readonly coaching_certificate?: string | null;
  readonly gender?: string | null;
  readonly height?: string | null;
  readonly weight?: string | null;
  readonly traget_weight?: string | null;
  readonly banner?: string | null;
  readonly currency?: string | null;
  readonly current_activity_lebel?: string | null;
  readonly meal_routine?: string | null;
  readonly login_provider?: string | null;
  readonly role?: UserRole | keyof typeof UserRole | null;
  readonly status?: UserStatus | keyof typeof UserStatus | null;
  readonly user_id?: string | null;
  readonly experience?: string | null;
  readonly BookSessions?: (BookSession | null)[] | null;
  readonly BookSessionsCoach?: (BookSession | null)[] | null;
  readonly expoToken?: string | null;
  readonly totalRating?: number | null;
  readonly totalReview?: number | null;
  readonly userStatus?: string | null;
  readonly isVerified?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly username: string;
  readonly name?: string | null;
  readonly email: string;
  readonly image?: string | null;
  readonly age?: number | null;
  readonly bio?: string | null;
  readonly phone?: string | null;
  readonly address?: string | null;
  readonly country?: string | null;
  readonly state?: string | null;
  readonly city?: string | null;
  readonly category?: string | null;
  readonly working_radius?: string | null;
  readonly hourly_rate?: number | null;
  readonly cancellation_charge?: string | null;
  readonly primary_id?: string | null;
  readonly secondary_id?: string | null;
  readonly coaching_certificate?: string | null;
  readonly gender?: string | null;
  readonly height?: string | null;
  readonly weight?: string | null;
  readonly traget_weight?: string | null;
  readonly banner?: string | null;
  readonly currency?: string | null;
  readonly current_activity_lebel?: string | null;
  readonly meal_routine?: string | null;
  readonly login_provider?: string | null;
  readonly role?: UserRole | keyof typeof UserRole | null;
  readonly status?: UserStatus | keyof typeof UserStatus | null;
  readonly user_id?: string | null;
  readonly experience?: string | null;
  readonly BookSessions: AsyncCollection<BookSession>;
  readonly BookSessionsCoach: AsyncCollection<BookSession>;
  readonly expoToken?: string | null;
  readonly totalRating?: number | null;
  readonly totalReview?: number | null;
  readonly userStatus?: string | null;
  readonly isVerified?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerBookSession = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BookSession, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly appointment_date: string;
  readonly session_time?: string | null;
  readonly session_incorporate_time?: string | null;
  readonly session_slot?: string | null;
  readonly location?: string | null;
  readonly trainingType?: string | null;
  readonly coachID: string;
  readonly status?: string | null;
  readonly reason?: string | null;
  readonly createdByID: string;
  readonly createdByIDCoach: string;
  readonly coach?: User | null;
  readonly created_by_id?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBookSession = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BookSession, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly appointment_date: string;
  readonly session_time?: string | null;
  readonly session_incorporate_time?: string | null;
  readonly session_slot?: string | null;
  readonly location?: string | null;
  readonly trainingType?: string | null;
  readonly coachID: string;
  readonly status?: string | null;
  readonly reason?: string | null;
  readonly createdByID: string;
  readonly createdByIDCoach: string;
  readonly coach: AsyncItem<User | undefined>;
  readonly created_by_id: AsyncItem<User | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type BookSession = LazyLoading extends LazyLoadingDisabled ? EagerBookSession : LazyBookSession

export declare const BookSession: (new (init: ModelInit<BookSession>) => BookSession) & {
  copyOf(source: BookSession, mutator: (draft: MutableModel<BookSession>) => MutableModel<BookSession> | void): BookSession;
}

type EagerMessage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Message, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly text?: string | null;
  readonly user?: User | null;
  readonly chatRoom?: ChatRoom | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly messageUserId?: string | null;
  readonly messageChatRoomId?: string | null;
}

type LazyMessage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Message, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly text?: string | null;
  readonly user: AsyncItem<User | undefined>;
  readonly chatRoom: AsyncItem<ChatRoom | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly messageUserId?: string | null;
  readonly messageChatRoomId?: string | null;
}

export declare type Message = LazyLoading extends LazyLoadingDisabled ? EagerMessage : LazyMessage

export declare const Message: (new (init: ModelInit<Message>) => Message) & {
  copyOf(source: Message, mutator: (draft: MutableModel<Message>) => MutableModel<Message> | void): Message;
}

type EagerChatRoom = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ChatRoom, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly member?: User | null;
  readonly coach?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly chatRoomMemberId?: string | null;
  readonly chatRoomCoachId?: string | null;
}

type LazyChatRoom = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ChatRoom, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly member: AsyncItem<User | undefined>;
  readonly coach: AsyncItem<User | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly chatRoomMemberId?: string | null;
  readonly chatRoomCoachId?: string | null;
}

export declare type ChatRoom = LazyLoading extends LazyLoadingDisabled ? EagerChatRoom : LazyChatRoom

export declare const ChatRoom: (new (init: ModelInit<ChatRoom>) => ChatRoom) & {
  copyOf(source: ChatRoom, mutator: (draft: MutableModel<ChatRoom>) => MutableModel<ChatRoom> | void): ChatRoom;
}

type EagerRating = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Rating, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly rating?: number | null;
  readonly description?: string | null;
  readonly coach?: User | null;
  readonly member?: User | null;
  readonly session_id?: BookSession | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly ratingCoachId?: string | null;
  readonly ratingMemberId?: string | null;
  readonly ratingSession_idId?: string | null;
}

type LazyRating = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Rating, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly rating?: number | null;
  readonly description?: string | null;
  readonly coach: AsyncItem<User | undefined>;
  readonly member: AsyncItem<User | undefined>;
  readonly session_id: AsyncItem<BookSession | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly ratingCoachId?: string | null;
  readonly ratingMemberId?: string | null;
  readonly ratingSession_idId?: string | null;
}

export declare type Rating = LazyLoading extends LazyLoadingDisabled ? EagerRating : LazyRating

export declare const Rating: (new (init: ModelInit<Rating>) => Rating) & {
  copyOf(source: Rating, mutator: (draft: MutableModel<Rating>) => MutableModel<Rating> | void): Rating;
}

type EagerBanner = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Banner, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly image?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBanner = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Banner, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly image?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Banner = LazyLoading extends LazyLoadingDisabled ? EagerBanner : LazyBanner

export declare const Banner: (new (init: ModelInit<Banner>) => Banner) & {
  copyOf(source: Banner, mutator: (draft: MutableModel<Banner>) => MutableModel<Banner> | void): Banner;
}

type EagerCategoryDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CategoryDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly image?: string | null;
  readonly title?: string | null;
  readonly timing?: string | null;
  readonly calories?: string | null;
  readonly bodyType?: CategoryDetailBodyType | keyof typeof CategoryDetailBodyType | null;
  readonly type?: CategoryDetailType | keyof typeof CategoryDetailType | null;
  readonly Category?: Category | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly categoryDetailCategoryId?: string | null;
}

type LazyCategoryDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CategoryDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly image?: string | null;
  readonly title?: string | null;
  readonly timing?: string | null;
  readonly calories?: string | null;
  readonly bodyType?: CategoryDetailBodyType | keyof typeof CategoryDetailBodyType | null;
  readonly type?: CategoryDetailType | keyof typeof CategoryDetailType | null;
  readonly Category: AsyncItem<Category | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly categoryDetailCategoryId?: string | null;
}

export declare type CategoryDetail = LazyLoading extends LazyLoadingDisabled ? EagerCategoryDetail : LazyCategoryDetail

export declare const CategoryDetail: (new (init: ModelInit<CategoryDetail>) => CategoryDetail) & {
  copyOf(source: CategoryDetail, mutator: (draft: MutableModel<CategoryDetail>) => MutableModel<CategoryDetail> | void): CategoryDetail;
}

type EagerCategory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Category, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title: string;
  readonly image?: string | null;
  readonly tag?: string | null;
  readonly CategoryDetail?: CategoryDetail | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly categoryCategoryDetailId?: string | null;
}

type LazyCategory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Category, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title: string;
  readonly image?: string | null;
  readonly tag?: string | null;
  readonly CategoryDetail: AsyncItem<CategoryDetail | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly categoryCategoryDetailId?: string | null;
}

export declare type Category = LazyLoading extends LazyLoadingDisabled ? EagerCategory : LazyCategory

export declare const Category: (new (init: ModelInit<Category>) => Category) & {
  copyOf(source: Category, mutator: (draft: MutableModel<Category>) => MutableModel<Category> | void): Category;
}