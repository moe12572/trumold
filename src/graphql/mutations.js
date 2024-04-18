/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createNotification = /* GraphQL */ `
  mutation CreateNotification(
    $input: CreateNotificationInput!
    $condition: ModelNotificationConditionInput
  ) {
    createNotification(input: $input, condition: $condition) {
      id
      url
      from {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      to {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      title
      message
      messageType
      createdAt
      updatedAt
      notificationFromId
      notificationToId
      __typename
    }
  }
`;
export const updateNotification = /* GraphQL */ `
  mutation UpdateNotification(
    $input: UpdateNotificationInput!
    $condition: ModelNotificationConditionInput
  ) {
    updateNotification(input: $input, condition: $condition) {
      id
      url
      from {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      to {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      title
      message
      messageType
      createdAt
      updatedAt
      notificationFromId
      notificationToId
      __typename
    }
  }
`;
export const deleteNotification = /* GraphQL */ `
  mutation DeleteNotification(
    $input: DeleteNotificationInput!
    $condition: ModelNotificationConditionInput
  ) {
    deleteNotification(input: $input, condition: $condition) {
      id
      url
      from {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      to {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      title
      message
      messageType
      createdAt
      updatedAt
      notificationFromId
      notificationToId
      __typename
    }
  }
`;
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
      id
      text
      user {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      chatRoom {
        id
        createdAt
        updatedAt
        chatRoomMemberId
        chatRoomCoachId
        __typename
      }
      createdAt
      updatedAt
      messageUserId
      messageChatRoomId
      __typename
    }
  }
`;
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
      id
      text
      user {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      chatRoom {
        id
        createdAt
        updatedAt
        chatRoomMemberId
        chatRoomCoachId
        __typename
      }
      createdAt
      updatedAt
      messageUserId
      messageChatRoomId
      __typename
    }
  }
`;
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
      id
      text
      user {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      chatRoom {
        id
        createdAt
        updatedAt
        chatRoomMemberId
        chatRoomCoachId
        __typename
      }
      createdAt
      updatedAt
      messageUserId
      messageChatRoomId
      __typename
    }
  }
`;
export const createChatRoom = /* GraphQL */ `
  mutation CreateChatRoom(
    $input: CreateChatRoomInput!
    $condition: ModelChatRoomConditionInput
  ) {
    createChatRoom(input: $input, condition: $condition) {
      id
      member {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      coach {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      chatRoomMemberId
      chatRoomCoachId
      __typename
    }
  }
`;
export const updateChatRoom = /* GraphQL */ `
  mutation UpdateChatRoom(
    $input: UpdateChatRoomInput!
    $condition: ModelChatRoomConditionInput
  ) {
    updateChatRoom(input: $input, condition: $condition) {
      id
      member {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      coach {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      chatRoomMemberId
      chatRoomCoachId
      __typename
    }
  }
`;
export const deleteChatRoom = /* GraphQL */ `
  mutation DeleteChatRoom(
    $input: DeleteChatRoomInput!
    $condition: ModelChatRoomConditionInput
  ) {
    deleteChatRoom(input: $input, condition: $condition) {
      id
      member {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      coach {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      chatRoomMemberId
      chatRoomCoachId
      __typename
    }
  }
`;
export const createRating = /* GraphQL */ `
  mutation CreateRating(
    $input: CreateRatingInput!
    $condition: ModelRatingConditionInput
  ) {
    createRating(input: $input, condition: $condition) {
      id
      rating
      description
      coach {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      member {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      session_id {
        id
        appointment_date
        session_time
        session_incorporate_time
        session_slot
        location
        trainingType
        coachID
        status
        reason
        createdByID
        createdByIDCoach
        paymentStatus
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      ratingCoachId
      ratingMemberId
      ratingSession_idId
      __typename
    }
  }
`;
export const updateRating = /* GraphQL */ `
  mutation UpdateRating(
    $input: UpdateRatingInput!
    $condition: ModelRatingConditionInput
  ) {
    updateRating(input: $input, condition: $condition) {
      id
      rating
      description
      coach {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      member {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      session_id {
        id
        appointment_date
        session_time
        session_incorporate_time
        session_slot
        location
        trainingType
        coachID
        status
        reason
        createdByID
        createdByIDCoach
        paymentStatus
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      ratingCoachId
      ratingMemberId
      ratingSession_idId
      __typename
    }
  }
`;
export const deleteRating = /* GraphQL */ `
  mutation DeleteRating(
    $input: DeleteRatingInput!
    $condition: ModelRatingConditionInput
  ) {
    deleteRating(input: $input, condition: $condition) {
      id
      rating
      description
      coach {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      member {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      session_id {
        id
        appointment_date
        session_time
        session_incorporate_time
        session_slot
        location
        trainingType
        coachID
        status
        reason
        createdByID
        createdByIDCoach
        paymentStatus
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      ratingCoachId
      ratingMemberId
      ratingSession_idId
      __typename
    }
  }
`;
export const createBanner = /* GraphQL */ `
  mutation CreateBanner(
    $input: CreateBannerInput!
    $condition: ModelBannerConditionInput
  ) {
    createBanner(input: $input, condition: $condition) {
      id
      title
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateBanner = /* GraphQL */ `
  mutation UpdateBanner(
    $input: UpdateBannerInput!
    $condition: ModelBannerConditionInput
  ) {
    updateBanner(input: $input, condition: $condition) {
      id
      title
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteBanner = /* GraphQL */ `
  mutation DeleteBanner(
    $input: DeleteBannerInput!
    $condition: ModelBannerConditionInput
  ) {
    deleteBanner(input: $input, condition: $condition) {
      id
      title
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createCategoryDetail = /* GraphQL */ `
  mutation CreateCategoryDetail(
    $input: CreateCategoryDetailInput!
    $condition: ModelCategoryDetailConditionInput
  ) {
    createCategoryDetail(input: $input, condition: $condition) {
      id
      image
      title
      timing
      calories
      bodyType
      type
      Category {
        id
        title
        image
        tag
        createdAt
        updatedAt
        categoryCategoryDetailId
        __typename
      }
      createdAt
      updatedAt
      categoryDetailCategoryId
      __typename
    }
  }
`;
export const updateCategoryDetail = /* GraphQL */ `
  mutation UpdateCategoryDetail(
    $input: UpdateCategoryDetailInput!
    $condition: ModelCategoryDetailConditionInput
  ) {
    updateCategoryDetail(input: $input, condition: $condition) {
      id
      image
      title
      timing
      calories
      bodyType
      type
      Category {
        id
        title
        image
        tag
        createdAt
        updatedAt
        categoryCategoryDetailId
        __typename
      }
      createdAt
      updatedAt
      categoryDetailCategoryId
      __typename
    }
  }
`;
export const deleteCategoryDetail = /* GraphQL */ `
  mutation DeleteCategoryDetail(
    $input: DeleteCategoryDetailInput!
    $condition: ModelCategoryDetailConditionInput
  ) {
    deleteCategoryDetail(input: $input, condition: $condition) {
      id
      image
      title
      timing
      calories
      bodyType
      type
      Category {
        id
        title
        image
        tag
        createdAt
        updatedAt
        categoryCategoryDetailId
        __typename
      }
      createdAt
      updatedAt
      categoryDetailCategoryId
      __typename
    }
  }
`;
export const createBookSession = /* GraphQL */ `
  mutation CreateBookSession(
    $input: CreateBookSessionInput!
    $condition: ModelBookSessionConditionInput
  ) {
    createBookSession(input: $input, condition: $condition) {
      id
      appointment_date
      session_time
      session_incorporate_time
      session_slot
      location
      trainingType
      coachID
      status
      reason
      createdByID
      createdByIDCoach
      coach {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      created_by_id {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      paymentStatus
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateBookSession = /* GraphQL */ `
  mutation UpdateBookSession(
    $input: UpdateBookSessionInput!
    $condition: ModelBookSessionConditionInput
  ) {
    updateBookSession(input: $input, condition: $condition) {
      id
      appointment_date
      session_time
      session_incorporate_time
      session_slot
      location
      trainingType
      coachID
      status
      reason
      createdByID
      createdByIDCoach
      coach {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      created_by_id {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      paymentStatus
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteBookSession = /* GraphQL */ `
  mutation DeleteBookSession(
    $input: DeleteBookSessionInput!
    $condition: ModelBookSessionConditionInput
  ) {
    deleteBookSession(input: $input, condition: $condition) {
      id
      appointment_date
      session_time
      session_incorporate_time
      session_slot
      location
      trainingType
      coachID
      status
      reason
      createdByID
      createdByIDCoach
      coach {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      created_by_id {
        id
        username
        name
        email
        image
        age
        bio
        phone
        address
        country
        state
        city
        category
        working_radius
        hourly_rate
        cancellation_charge
        primary_id
        secondary_id
        coaching_certificate
        gender
        height
        weight
        traget_weight
        banner
        currency
        current_activity_lebel
        meal_routine
        login_provider
        role
        status
        user_id
        experience
        expoToken
        totalRating
        totalReview
        userStatus
        isVerified
        accountId
        isPaymentVerified
        isAdminStatus
        createdAt
        updatedAt
        __typename
      }
      paymentStatus
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createCategory = /* GraphQL */ `
  mutation CreateCategory(
    $input: CreateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    createCategory(input: $input, condition: $condition) {
      id
      title
      image
      tag
      CategoryDetail {
        id
        image
        title
        timing
        calories
        bodyType
        type
        createdAt
        updatedAt
        categoryDetailCategoryId
        __typename
      }
      createdAt
      updatedAt
      categoryCategoryDetailId
      __typename
    }
  }
`;
export const updateCategory = /* GraphQL */ `
  mutation UpdateCategory(
    $input: UpdateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    updateCategory(input: $input, condition: $condition) {
      id
      title
      image
      tag
      CategoryDetail {
        id
        image
        title
        timing
        calories
        bodyType
        type
        createdAt
        updatedAt
        categoryDetailCategoryId
        __typename
      }
      createdAt
      updatedAt
      categoryCategoryDetailId
      __typename
    }
  }
`;
export const deleteCategory = /* GraphQL */ `
  mutation DeleteCategory(
    $input: DeleteCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    deleteCategory(input: $input, condition: $condition) {
      id
      title
      image
      tag
      CategoryDetail {
        id
        image
        title
        timing
        calories
        bodyType
        type
        createdAt
        updatedAt
        categoryDetailCategoryId
        __typename
      }
      createdAt
      updatedAt
      categoryCategoryDetailId
      __typename
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      username
      name
      email
      image
      age
      bio
      phone
      address
      country
      state
      city
      category
      working_radius
      hourly_rate
      cancellation_charge
      primary_id
      secondary_id
      coaching_certificate
      gender
      height
      weight
      traget_weight
      banner
      currency
      current_activity_lebel
      meal_routine
      login_provider
      role
      status
      user_id
      experience
      BookSessions {
        nextToken
        __typename
      }
      BookSessionsCoach {
        nextToken
        __typename
      }
      expoToken
      totalRating
      totalReview
      userStatus
      isVerified
      accountId
      isPaymentVerified
      isAdminStatus
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      username
      name
      email
      image
      age
      bio
      phone
      address
      country
      state
      city
      category
      working_radius
      hourly_rate
      cancellation_charge
      primary_id
      secondary_id
      coaching_certificate
      gender
      height
      weight
      traget_weight
      banner
      currency
      current_activity_lebel
      meal_routine
      login_provider
      role
      status
      user_id
      experience
      BookSessions {
        nextToken
        __typename
      }
      BookSessionsCoach {
        nextToken
        __typename
      }
      expoToken
      totalRating
      totalReview
      userStatus
      isVerified
      accountId
      isPaymentVerified
      isAdminStatus
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      username
      name
      email
      image
      age
      bio
      phone
      address
      country
      state
      city
      category
      working_radius
      hourly_rate
      cancellation_charge
      primary_id
      secondary_id
      coaching_certificate
      gender
      height
      weight
      traget_weight
      banner
      currency
      current_activity_lebel
      meal_routine
      login_provider
      role
      status
      user_id
      experience
      BookSessions {
        nextToken
        __typename
      }
      BookSessionsCoach {
        nextToken
        __typename
      }
      expoToken
      totalRating
      totalReview
      userStatus
      isVerified
      accountId
      isPaymentVerified
      isAdminStatus
      createdAt
      updatedAt
      __typename
    }
  }
`;
