import React, { ReactNode } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { Spinner } from 'src/ReportBuilder/components/Spinner';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IDefaultProps {
  loader: ReactNode;
}

interface IProps extends Partial<IDefaultProps> {
  id: string;
  tabsItems: ITab[];
  defaultTab?: number;
  onTabClicked?: (key: number) => void;
}

export interface ITab {
  title: string;
  content: ReactNode;
  visible: boolean;
  loading?: boolean;
  error?: string;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class TabsControl extends React.PureComponent<IProps> {

  public static defaultProps: IDefaultProps = {
    loader: <Spinner />,
  };

  public render() {
    const { id, defaultTab } = this.props;

    return (
      <Tabs
        id={id}
        className='rb-tabs-control'
        defaultActiveKey={defaultTab}
        mountOnEnter={true}
        onSelect={this.onSelect}
      >
        {this.renderTabs()}
      </Tabs>
    );
  }

  private renderTabs() {
    const { tabsItems } = this.props;

    return tabsItems.map((tab, index) => {
      if (tab.visible) {
        return (
          <Tab
            key={index}
            eventKey={index}
            title={tab.title}
            tabClassName='rb-tab'
          >
            {this.renderTabContent(tab)}
          </Tab>
        );
      }

      return null;
    });
  }

  private renderTabContent = (tab: ITab) => {
    const { loader } = this.props;

    if (!tab || !tab.content) {
      return null;
    }

    if (tab.error && !tab.loading) {
      return <div className='alert alert-danger'>{tab.error}</div>;
    }

    if (tab.loading) {
      return loader;
    }

    return <div>{tab.content}</div>;
  }

  private onSelect = (key) => {
    const { onTabClicked } = this.props;

    if (onTabClicked) {
      onTabClicked(key);
    }
  }
}

// #endregion
