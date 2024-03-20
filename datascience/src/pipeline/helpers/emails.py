import mimetypes
import smtplib
from email.message import EmailMessage
from mimetypes import guess_type
from pathlib import Path
from typing import List, Union

from config import (
    EMAIL_SERVER_PORT,
    EMAIL_SERVER_URL,
    MONITORENV_SENDER_EMAIL_ADDRESS,
)


def create_html_email(
    to: Union[str, List[str]],
    subject: str,
    html: str,
    from_: str = MONITORENV_SENDER_EMAIL_ADDRESS,
    cc: Union[str, List[str]] = None,
    bcc: Union[str, List[str]] = None,
    images: List[Path] = None,
    attachments: dict = None,
    reply_to: str = None,
) -> EmailMessage:
    """
    Creates a `email.EmailMessage` with the defined parameters.

    Args:
        to (Union[str, List[str]]): email address or list of email addresses of
          recipient(s)
        subject (str): Subject of the email.
        html (str): html representation of the email's content.
        from_ (str, optional): `From` field. Defaults to env var
          `MONITORENV_SENDER_EMAIL_ADDRESS`.
        cc (Union[str, List[str]], optional): `Cc` field with optional email address
        (or list of email addresses) of copied recipient(s). Defaults to None.
        bcc (Union[str, List[str]], optional): `Bcc` field with optional email address
        (or list of email addresses) of hidden copied recipient(s). Defaults to None.
        images (List[Path], optional): List of `Path` to images on the server's file
          system to attach to the email. These images can be displayed in the html body
          of the email by referencing them in the `src` attribute of an `<img>` tag as
          `cid:<image_name>`, where `<image_name>` is the image file's name.

          For example: `/a/b/c/my_image_123.png` can be included in the html message
          as :

            `<img src="cid:my_image_123.png">` in the html message.

          Defaults to None.
        attachments (dict, optional): `dict` of attachments to add to the email.
          Consists of {filename : bytes} value pairs. Defaults
          to None.
        reply_to (str, optional): if given, added as `Reply-To` header. Defaults to
          None.

    Returns:
        EmailMessage
    """

    if isinstance(to, list):
        to = ", ".join(to)

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = from_
    msg["To"] = to

    if cc:
        if isinstance(cc, list):
            cc = ", ".join(cc)
        msg["Cc"] = cc

    if bcc:
        if isinstance(bcc, list):
            bcc = ", ".join(bcc)
        msg["Bcc"] = bcc

    if reply_to:
        msg["Reply-To"] = reply_to

    msg.set_content(html, subtype="html")

    if images:
        for image in images:
            (mimetype, _) = guess_type(image)
            (maintype, subtype) = mimetype.split("/")

            with open(image, "rb") as f:
                img_data = f.read()
            msg.add_related(
                img_data,
                maintype=maintype,
                subtype=subtype,
                filename=image.name,
                cid=f"<{image.name}>",
            )

    if attachments:
        for filename, content in attachments.items():
            ctype, encoding = mimetypes.guess_type(filename)
            if ctype is None or encoding is not None:
                # No guess could be made, or the file is encoded (compressed), so
                # use a generic bag-of-bits type.
                ctype = "application/octet-stream"
            maintype, subtype = ctype.split("/", 1)
            msg.add_attachment(
                content,
                maintype=maintype,
                subtype=subtype,
                filename=filename,
            )

    return msg


def send_email(msg: EmailMessage) -> dict:
    """
    Sends input email using the contents of `From` header as sender and `To`, `Cc`
    and `Bcc` headers as recipients.

    This method will return normally if the mail is accepted for at least
    one recipient.  It returns a dictionary, with one entry for each
    recipient that was refused.  Each entry contains a tuple of the SMTP
    error code and the accompanying error message sent by the server, like :

      { "three@three.org" : ( 550 ,"User unknown" ) }

    Args:
        msg (EmailMessage): `email.message.EmailMessage` to send.

    Returns:
        dict: {email_address : (error_code, error_message)} for all recipients that
          were refused.

    Raises:
        SMTPHeloError: The server didn't reply properly to the helo greeting.
        SMTPRecipientsRefused: The server rejected ALL recipients (no mail was sent).
        SMTPSenderRefused: The server didn't accept the from_addr.
        SMTPDataError: The server replied with an unexpected error code (other than a
          refusal of a recipient).
        SMTPNotSupportedError: The mail_options parameter includes 'SMTPUTF8' but the
          SMTPUTF8 extension is not supported by the server.
        ValueError: if there is more than one set of 'Resent-' headers
    """

    assert EMAIL_SERVER_URL is not None
    assert EMAIL_SERVER_PORT is not None

    with smtplib.SMTP(host=EMAIL_SERVER_URL, port=EMAIL_SERVER_PORT) as server:
        send_errors = server.send_message(msg)
    return send_errors
