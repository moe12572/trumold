/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getNotification = /* GraphQL */ `
  query GetNotification($id: ID!) {
    getNotification(id: $id) {
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
        BookSessions {
          nextToken
        }
        BookSessionsCoach {
          nextToken
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
        BookSessions {
          nextToken
        }
        BookSessionsCoach {
          nextToken
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
      }
      title
      message
      messageType
      createdAt
      updatedAt
      notificationFromId
      notificationToId
    }
  }
`;
export const listNotifications = /* GraphQL */ `
  query ListNotifications(
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        }
        title
        message
        messageType
        createdAt
        updatedAt
        notificationFromId
        notificationToId
      }
      nextToken
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
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
        BookSessions {
          nextToken
        }
        BookSessionsCoach {
          nextToken
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
      }
      chatRoom {
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
        }
        createdAt
        updatedAt
        chatRoomMemberId
        chatRoomCoachId
      }
      createdAt
      updatedAt
      messageUserId
      messageChatRoomId
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        }
        chatRoom {
          id
          createdAt
          updatedAt
          chatRoomMemberId
          chatRoomCoachId
        }
        createdAt
        updatedAt
        messageUserId
        messageChatRoomId
      }
      nextToken
    }
  }
`;
export const getChatRoom = /* GraphQL */ `
  query GetChatRoom($id: ID!) {
    getChatRoom(id: $id) {
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
        BookSessions {
          nextToken
        }
        BookSessionsCoach {
          nextToken
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
        BookSessions {
          nextToken
        }
        BookSessionsCoach {
          nextToken
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
      }
      createdAt
      updatedAt
      chatRoomMemberId
      chatRoomCoachId
    }
  }
`;
export const listChatRooms = /* GraphQL */ `
  query ListChatRooms(
    $filter: ModelChatRoomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        }
        createdAt
        updatedAt
        chatRoomMemberId
        chatRoomCoachId
      }
      nextToken
    }
  }
`;
export const getRating = /* GraphQL */ `
  query GetRating($id: ID!) {
    getRating(id: $id) {
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
        BookSessions {
          nextToken
        }
        BookSessionsCoach {
          nextToken
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
        BookSessions {
          nextToken
        }
        BookSessionsCoach {
          nextToken
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
        }
        paymentStatus
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      ratingCoachId
      ratingMemberId
      ratingSession_idId
    }
  }
`;
export const listRatings = /* GraphQL */ `
  query ListRatings(
    $filter: ModelRatingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRatings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        }
        createdAt
        updatedAt
        ratingCoachId
        ratingMemberId
        ratingSession_idId
      }
      nextToken
    }
  }
`;
export const getBanner = /* GraphQL */ `
  query GetBanner($id: ID!) {
    getBanner(id: $id) {
      id
      title
      image
      createdAt
      updatedAt
    }
  }
`;
export const listBanners = /* GraphQL */ `
  query ListBanners(
    $filter: ModelBannerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBanners(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        image
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCategoryDetail = /* GraphQL */ `
  query GetCategoryDetail($id: ID!) {
    getCategoryDetail(id: $id) {
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
        }
        createdAt
        updatedAt
        categoryCategoryDetailId
      }
      createdAt
      updatedAt
      categoryDetailCategoryId
    }
  }
`;
export const listCategoryDetails = /* GraphQL */ `
  query ListCategoryDetails(
    $filter: ModelCategoryDetailFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCategoryDetails(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        }
        createdAt
        updatedAt
        categoryDetailCategoryId
      }
      nextToken
    }
  }
`;
export const getBookSession = /* GraphQL */ `
  query GetBookSession($id: ID!) {
    getBookSession(id: $id) {
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
        BookSessions {
          nextToken
        }
        BookSessionsCoach {
          nextToken
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
        BookSessions {
          nextToken
        }
        BookSessionsCoach {
          nextToken
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
      }
      paymentStatus
      createdAt
      updatedAt
    }
  }
`;
export const listBookSessions = /* GraphQL */ `
  query ListBookSessions(
    $filter: ModelBookSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBookSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        }
        paymentStatus
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCategory = /* GraphQL */ `
  query GetCategory($id: ID!) {
    getCategory(id: $id) {
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
        Category {
          id
          title
          image
          tag
          createdAt
          updatedAt
          categoryCategoryDetailId
        }
        createdAt
        updatedAt
        categoryDetailCategoryId
      }
      createdAt
      updatedAt
      categoryCategoryDetailId
    }
  }
`;
export const listCategories = /* GraphQL */ `
  query ListCategories(
    $filter: ModelCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        }
        createdAt
        updatedAt
        categoryCategoryDetailId
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
        items {
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
        }
        nextToken
      }
      BookSessionsCoach {
        items {
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
        }
        nextToken
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
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        }
        BookSessionsCoach {
          nextToken
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
      }
      nextToken
    }
  }
`;
export const bookSessionBySorting = /* GraphQL */ `
  query BookSessionBySorting(
    $createdByID: ID!
    $appointment_date: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelBookSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    bookSessionBySorting(
      createdByID: $createdByID
      appointment_date: $appointment_date
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        }
        paymentStatus
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const bookSessionBySortingCoach = /* GraphQL */ `
  query BookSessionBySortingCoach(
    $createdByIDCoach: ID!
    $appointment_date: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelBookSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    bookSessionBySortingCoach(
      createdByIDCoach: $createdByIDCoach
      appointment_date: $appointment_date
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        }
        paymentStatus
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;