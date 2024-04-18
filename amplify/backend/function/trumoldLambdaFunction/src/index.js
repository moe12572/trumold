const stripe = require("stripe")(
    "sk_test_51LnKCqC5tDaAuskRzjlZN2uIZ4ccAIyH2MBPEBYZYKcgHsNCXZSXDAoiwk7rkIEUrG8XSPUUgMiXHahwD4koEocH00qHQBmVeU"
  );
  exports.handler = async (event) => {
    try {
      if (event.httpMethod === "POST") {
        let bodyData = JSON.parse(event.body);
        if (bodyData?.requestType === "createAccount") {
          let accountRes = await createAccount(bodyData.payload);
          return handleReponse(200, accountRes);
        } else if (bodyData?.requestType === "getAccount") {
          if (!bodyData?.accountId) {
            return handleReponse(400, "The account id field is required");
          }
          let result = await getAccount(bodyData?.accountId);
          return handleReponse(200, result);
        } else if (bodyData?.requestType === "createAccountLoginLink") {
          if (!bodyData?.accountId) {
            return handleReponse(400, "The account id field is required");
          }
          let updateResult = await createAccountLoginLink(bodyData?.accountId);
          return handleReponse(200, updateResult);
        } else if (bodyData?.requestType === "paymentIntent") {
          if (!bodyData?.amount) {
            throw new Error("The amount field is required");
          }
          const paymentIntent = await paymentIntentCreate(bodyData?.payload);
          return handleReponse(200, paymentIntent);
        } else {
          return handleReponse(200, "Not any type");
        }
      }
      return {
        statusCode: 200,
        body: JSON.stringify("Hello Trumold"),
      };
    } catch (error) {
      return handleReponse(400, "Sothing went wrong");
    }
  };
  function handleReponse(statusCode, body) {
    return {
      statusCode: statusCode,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    };
  }
  async function createAccount(params) {
    try {
      let accounts = await stripe.accounts.create(params);
      return accounts;
    } catch (error) {
      return handleReponse(400, error);
    }
  }
  async function getAccount(CONNECTED_ACCOUNT_ID) {
    try {
      const account = await stripe.accounts.retrieve(CONNECTED_ACCOUNT_ID);
      return account;
    } catch (error) {
      return handleReponse(400, error);
    }
  }
  async function createAccountLoginLink(CONNECTED_ACCOUNT_ID) {
    try {
      const accountLink = await stripe.accountLinks.create({
        account: CONNECTED_ACCOUNT_ID,
        refresh_url: "https://play.google.com/",
        return_url: "https://play.google.com/",
        type: "account_onboarding",
      });
      return accountLink;
    } catch (error) {
      return handleReponse(400, error);
    }
  }
  async function paymentIntentCreate(params) {
    try {
      let amount = params.amount;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: parseFloat(amount) * 100,
        currency: "usd",
        transfer_group: params?.email ? params.email : "trumold",
        description: params?.email ? params.email : "trumold"
      });
      const paymentConfirm = await stripe.paymentIntents.confirm(
        paymentIntent.id,
        { payment_method: "pm_card_visa" }
      );
      const balanceTransaction = await stripe.balanceTransactions.retrieve(
        paymentConfirm?.charges?.data[0].balance_transaction
      );
      let netBalance = balanceTransaction?.net / 100; // 
      let stripe_fee = amount - netBalance; //stripe fee
      let coach = (amount * 90) / 100; //total amount of 90%
      let gray_matter = (amount * 1.5) / 100; //total amount of 1.5%
      let trumold =  amount - (stripe_fee + coach + gray_matter); //

      let sourceId = balanceTransaction.source;
      let _coach = parseFloat(parseFloat(coach).toFixed(2)) * 100;
      await stripe.transfers.create({
        amount: Number(parseFloat(parseFloat(_coach).toFixed(2))),
        currency: "usd",
        source_transaction: sourceId,
        destination: params.coachAccountId,
        transfer_group: params?.email ? params.email : "trumold",
      });
      let _gray_matter = parseFloat(parseFloat(gray_matter).toFixed(2)) * 100;
      await stripe.transfers.create({
        amount: Number(parseFloat(parseFloat(_gray_matter).toFixed(2))),
        currency: "usd",
        destination: params.grayMatterAccountId,
        source_transaction: sourceId,
        transfer_group: params?.email ? params.email : "trumold",
      });
      let _trumold = parseFloat(parseFloat(trumold).toFixed(2)) * 100;
      await stripe.transfers.create({
        amount: Number(parseFloat(parseFloat(_trumold).toFixed(2))),
        currency: "usd",
        destination: params.trumoldAccountId,
        source_transaction: sourceId,
        transfer_group: params?.email ? params.email : "trumold",
      });
      return balanceTransaction;
    } catch (error) {
      return handleReponse(400, error);
    }
  }