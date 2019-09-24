function template(userid) {
  var link = "http://localhost:3000/resetpassword.html?userid=" + userid;
  var str = `<p>Hi,</p>

<p>
  Someone recently requested a password change for your Holisol Logistics account. If this
  was you, you can set a new password here:
</p>

<button><a href="${link}">Reset Password</a></button>

<p>
  If you don't want to change your password or didn't request this, just ignore
  and delete this message.
</p>

<p>To keep your account secure, please don't forward this email to anyone.</p>`;
  // var str = `<p>Congrats you have a job ${name}</p>`;
  return str;
}
module.exports = template;
