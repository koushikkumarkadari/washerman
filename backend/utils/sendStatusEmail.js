// utils/sendOtpEmail.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER ,
    pass: process.env.EMAIL_PASS
  }
});

const sendStatusEmail = async (email, order,userOftheOrder,washerman, status) => {
    console.log(order)
    const {items,total,createdAt} = order;
    const id = order._id;
    const washermanName = `${washerman.firstName} ${washerman.lastName}`;
    const userName = `${userOftheOrder.firstName} ${userOftheOrder.lastName}`;
    const itemsList = items.map(item => `${item.name} (${item.quantity})`).join(', ');
    const orderDetails = `Order ID: ${id}\nWasherman: ${washermanName}\nUser: ${userName}\nItems: ${itemsList}\nTotal: $${total}\nCreated At: ${createdAt}`;
    if(status === 'completed'){
        const mailOptions = {
            from: "WASHERMAN",
            to: email,
            subject: 'STATUS OF YOUR CLOTHES OF ID: ' + id,
            text: `your clothes are washed and ${status}.take them.these are the details of your order:\n${orderDetails}`
          };
    
          await transporter.sendMail(mailOptions);
    }
    else if(status==='pending'){
        const mailOptions = {
            from: "WASHERMAN",
            to: email,
            subject: 'STATUS OF YOUR CLOTHES OF ID: ' + id,
            text: `it is in ${status} state.wait for some time.these are the details of your order:\n${orderDetails}`
          };
    
          await transporter.sendMail(mailOptions);
    }
};

export default sendStatusEmail;
