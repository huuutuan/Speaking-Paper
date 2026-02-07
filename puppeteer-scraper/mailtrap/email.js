const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require("./emailTemplate")
const { mailtrapClient, sender } = require("./mailtrap.config")

const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{email}]
	try {
		const response = await mailtrapClient.send({
			from:sender,
			to:recipient,
			subject: "Verify your email",
			html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			category: "Email Verification"
		})
		console.log("Email sended successfully", response);
	} catch (error) {
		console.log(`error send verification email`, error);
		
		throw new Error(`Error Send verification email: ${error}`);
	}
}
const sendWelcomeEmail = async (email, name) => {

	const recipient = [{email}]
	try {
		const response = mailtrapClient.send({
			from:sender,
			to:recipient,
			template_uuid: "a18d6e69-0fcc-4bc2-9f7e-06bd85dbf536",
			template_variables: {
				"company_info_name": "Test_Company_info_name",
				"name": "Test_Name",
				"company_info_address": "Test_Company_info_address",
				"company_info_city": "Test_Company_info_city",
				"company_info_zip_code": "Test_Company_info_zip_code",
				"company_info_country": "Test_Company_info_country"
		      	}
		})
		console.log("Welcome email sended successfully", response);
		

	} catch(error) {
		console.log(`error send welcome email`, error);	
		throw new Error(`Error Send welcome email: ${error}`);
	}
}

const sendResetPasswordEmail = async (email, resetPasswordUrl) => {
	const recipient = [{email}];
	try {
		const response = mailtrapClient.send({
			from:sender,
			to:recipient,
			subject: "Reset your password",
			html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetPasswordUrl),
			category: "Password Reset"
		})
		console.log(response);
		
	} catch (error) {
		console.log(`error send reset password email`, error);
		throw new Error(`Error Send reset password email: ${error}`);
	}
}

const sendSuccessPasswordResetEmail = async (email) => {
	const recipient = [{email}];
	try {
		const response = mailtrapClient.send({
			from:sender,
			to:recipient,
			subject: "Password reset successful",
			html:PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset"
		})
		
		
	} catch (error) {
		console.log(`error send reset password email`, error);
		throw new Error(`Error Send reset password email: ${error}`);
	}
}
module.exports = {sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendSuccessPasswordResetEmail}
// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);