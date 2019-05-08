import React from 'react';

// #region -------------- Component -------------------------------------------------------------------

export class Spinner extends React.PureComponent {
  public render() {
    return (
      <div className='rb-spinner'>
        <img src={require('images/common/spinner.gif')} alt='spinner' />
      </div>
    );
  }
}

// #endregion
