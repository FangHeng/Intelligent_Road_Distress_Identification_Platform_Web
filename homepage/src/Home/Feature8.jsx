import React from 'react';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';
import { Carousel as AntCarousel, Row, Col } from 'antd';
import { getChildrenToRender } from './utils';

class Feature8 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.carouselRef = React.createRef();
    this.state = {
      current: 0,
    };
  }

  onTitleClick = (_, i) => {
    const carouselRef = this.carouselRef.current.childRefs.carousel;
    carouselRef.goTo(i);
  };

  onBeforeChange = (_, newIndex) => {
    this.setState({
      current: newIndex,
    });
  };

  getChildrenToRender = (dataSource) => {
    const { current } = this.state;
    const { Carousel, childWrapper: buttonWrapper } = dataSource;
    const { children: carouselChild, wrapper, ...carouselProps } = Carousel;
    const {
      titleWrapper,
      children: childWrapper,
      ...childrenProps
    } = carouselChild;

    const {
      barWrapper,
      title: titleChild,
      ...titleWrapperProps
    } = titleWrapper;
    const titleToRender = [];

    const childrenToRender = childWrapper.map((item, ii) => {
      const { title, children: childRow, ...rowProps } = item;
      if (childWrapper.length > 1) {
        titleToRender.push(
          <div
            {...title}
            key={ii.toString()}
            onClick={(e) => {
              this.onTitleClick(e, ii);
            }}
            className={
              ii === current
                ? `${title.className || ''} active`
                : title.className
            }
          >
            {title.children}
          </div>
        );
      }
      const childrenItem = childRow.map(($item, i) => {
        const { children: colChild, arrow, ...colProps } = $item;
        const { ...childProps } = colChild;
        return (
          <Col {...colProps} key={i.toString()}>
            <div {...childProps}>
              {colChild.children.map(getChildrenToRender)}
            </div>
            {arrow && (
              <div {...arrow}>
                <img src={arrow.children} alt="img" />
              </div>
            )}
          </Col>
        );
      });

      return (
        <div key={ii.toString()}>
          <QueueAnim
            component={Row}
            type="bottom"
            componentProps={{ type: 'flex' }}
            {...rowProps}
          >
            {childrenItem}
          </QueueAnim>
        </div>
      );
    });

    return (
      <QueueAnim
        key="queue"
        type="bottom"
        ref={this.carouselRef}
        {...childrenProps}
      >
        {childWrapper.length > 1 && (
          <div {...titleWrapperProps} key="title">
            <div {...titleChild}>{titleToRender}</div>
          </div>
        )}
        <AntCarousel
          key="carousel"
          {...carouselProps}
          infinite={false}
          beforeChange={this.onBeforeChange}
        >
          {childrenToRender}
        </AntCarousel>
        <div key="button" {...buttonWrapper}>
          {buttonWrapper.children.map(getChildrenToRender)}
        </div>
      </QueueAnim>
    );
  };

  render() {
    const { dataSource, isMobile, ...props } = this.props;
    const { titleWrapper } = dataSource;
    return (
      <div {...props} {...dataSource.wrapper}>
        <div {...dataSource.page}>
          <div {...dataSource.titleWrapper}>
            {titleWrapper.children.map(getChildrenToRender)}
          </div>
          <OverPack {...dataSource.OverPack}>
            {this.getChildrenToRender(dataSource)}
          </OverPack>
        </div>
      </div>
    );
  }
}
export default Feature8;
