
/** 
 * Error for if the state string in localStorage doesn't match the state parameter
 *  returned from Discord OAuth
 */
export class CsrfStateError extends Error {
  constructor(message = 'Clickjacked!') {
    super(message);
    this.message = message;
  }
}