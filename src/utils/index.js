import { Auth,Storage } from "aws-amplify";
export const GOOGLE_API_KEY ="AIzaSyBeSPkr_qgSSPvzOdkONen2yfncgt8u2d0"
// export const AWS_API_URL='https://oez2clvisd.execute-api.us-east-1.amazonaws.com/prod/payment';// old
export const AWS_API_URL='https://hfn77gx8e2.execute-api.us-east-1.amazonaws.com/staging/payments/payment';//
export const STRIPE_PUBLIC_KEY ='pk_test_51LnKCqC5tDaAuskR4FvI9KbXwy56FBJsVP6Xx6TEirJt1L7BRTXELOeKl113zc0TXqyprBQDWdxOXGvDWX1RBnY000QcdMOHzn';
export const GRAY_MATTER_ACCOUNT_ID='acct_1MhSfvFmQ0Oy8s46';
export const TRUMOLD_ACCOUNT_ID ='acct_1MhPmcCLfYGH2c3k';
export const EMAIL_REGEX =/^[a-zA-Z0-9!#$%&’*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&’*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2}|aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel)$/
const numericFullMonthName = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

function sessionDateFormat(date) {
  if (!date) return "";
  var event = new Date(date);
  let mm = numericFullMonthName[event.getMonth()];
  let dd = event.getDate();
  let year = event.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
}
  return `${year}-${mm}-${dd}`;
}

function userToken(user){
  return user.signInUserSession.accessToken.jwtToken;
}

async function currentUser() {
  await Auth.currentAuthenticatedUser()
    .then((user) => {
      return user.signInUserSession.accessToken.jwtToken;
    })
    .catch(() => {
    });
}

async function getDataWithImage(items){
  if(items && items!==null){
    items = await Promise.all(
      items.map(async (item) => {
        if (item.image && item.image !== null) {
          const imageKey = await Storage.get(item.image, {
            level: "public",
          });
          item.image = imageKey;
        }
        if (item.banner && item.banner !== null) {
          const bannerKey = await Storage.get(item.banner, {
            level: "public",
          });
          item.banner = bannerKey;
        }
        if (item.created_by_id && item.created_by_id.image && item.created_by_id.image !== null) {
          const created_by_idKey = await Storage.get(item.created_by_id.image, {
            level: "public",
          });
          item.created_by_id.image = created_by_idKey;
        }
        if (item.member && item.member.image && item.member.image !== null) {
          const memberKey = await Storage.get(item.member.image, {
            level: "public",
          });
          item.member.image = memberKey;
        }
        if (item.coaching_certificate && item.coaching_certificate !== null) {
          const imagecoaching_certificateKey = await Storage.get(item.coaching_certificate, {
            level: "public",
          });
          item.coaching_certificate = imagecoaching_certificateKey;
        }
        if (item.coach && item.coach.image && item.coach.image !== null) {
          const coachKey = await Storage.get(item.coach.image, {
            level: "public",
          });
          item.coach.image = coachKey;
        }
        return item;
      })
    );
  }
  return items
}

async function uploadImage(imageUrl,imageName){
 
  const photo = await fetch(imageUrl);
  const photoBlob = await photo.blob();
  const fileName =`${imageName}_${Math.random().toString(18).slice(3).substr(0, 10)}.png`;
  const folder = `images/${fileName}`;
  await Storage.put(folder, photoBlob, {
    level: "public",
    contentType: "image/jpg",
  });
  return folder
}

async function removeImageFromS3(name){
  await Storage.remove(name)
    .then(result => console.log('Deleted', result))
    .catch(err => console.log(err));
}

export { sessionDateFormat,userToken,getDataWithImage,removeImageFromS3,uploadImage };
