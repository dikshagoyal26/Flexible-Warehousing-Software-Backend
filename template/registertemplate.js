function template(userid) {
  var str = `<h1>
  We're verifying a recent sign-in for ${userid}:
</h1>
<p>
  You're receiving this message because of a successful sign-in from a device.
  If you believe that this sign-in is suspicious, please reset your password
  immediately.
</p>

<p>
  If you're aware of this sign-in, please disregard this notice. This can happen
  when you use your browser's incognito or private browsing mode or clear your
  cookies.
</p>
<p>Thanks,</p>

<p>Holisol</p>`;
  return str;
}
module.exports = template;
