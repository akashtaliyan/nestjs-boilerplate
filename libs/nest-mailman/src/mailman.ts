import { MailMessage } from './message';
import { MailmanService } from './service';
export class Mailman {
  private recipients: string | string[];
  private ccReceipents: string | string[];
  private bccReceipents: string | string[];
  private sender: string;
  private _replyTo: string;
  private _inReplyTo: string;

  private constructor() {
    this.sender = '';
    this._replyTo = '';
    this._inReplyTo = '';
    this.recipients = '';
    this.ccReceipents = '';
    this.bccReceipents = '';
  }

  /**
   * Returns new instance
   */
  static init() {
    return new Mailman();
  }

  /**
   * `FROM` in email address.
   * Use this method to override the `from` address provided in configuration.
   * @param sender
   */
  from(sender: string): this {
    this.sender = sender;
    return this;
  }

  /**
   * `REPLY_TO` in email address.
   * Use this method to override the `reply_to` address provided in configuration or to add one.
   * @param replyToEmail
   */
  replyTo(replyToEmail: string): this {
    this._replyTo = replyToEmail;
    return this;
  }

  /**
   * `IN_REPLY_TO` in email address.
   * Use this method to provide the `in_reply_to` header.
   * @param replyToEmail
   */
  inReplyTo(messageId: string): this {
    this._inReplyTo = messageId;
    return this;
  }

  /**
   * `TO` in email address
   * @param recipients
   */
  to(recipients: string | string[]): this {
    this.recipients = recipients;
    return this;
  }

  /**
   * `CC` in email addres
   * @param ccrecipients
   */
  cc(ccReceipents: string | string[]): this {
    this.ccReceipents = ccReceipents;
    return this;
  }

  /**
   * `BCC` in email address
   * @param bccReceipents
   */
  bcc(bccReceipents: string | string[]): this {
    this.bccReceipents = bccReceipents;
    return this;
  }

  /**
   * Send mail
   * @param mail
   */
  send(mail: MailMessage) {
    return MailmanService.send({
      mail,
      cc: this.ccReceipents,
      bcc: this.bccReceipents,
      sender: this.sender,
      replyTo: this._replyTo,
      inReplyTo: this._inReplyTo,
      recipients: this.recipients,
    });
  }
}
