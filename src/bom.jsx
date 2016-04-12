'use strict'
const React          = require('react');
const _              = require('lodash');
const oneClickBOM    = require('1-click-bom');
const browserVersion = require('browser-version');
const $              = require('jquery');

let BOM = React.createClass({
  getInitialState: function() {
    return {
      onClick: function () {
        window.open('//1clickBOM.com', '_self');
      },
      switched: false
    };
  },
  updateTables: function () {
    if (($(window).width() < 767) && !this.state.switched) {
      this.setState({switched: true});
      $('table.responsive').each(function(i, element) {
        this.splitTable($(element));
      }.bind(this));
      return true;
    }else if (this.state.switched && ($(window).width() > 767)) {
      this.setState({switched: false});
      $('table.responsive').each(function(i, element) {
        this.unsplitTable($(element));
      }.bind(this))
    }
  },
  splitTable: function (original) {
    original.wrap("<div class='table-wrapper' />");
    var copy = original.clone();
    copy.find("td:not(:first-child), th:not(:first-child)").css("display", "none");
    copy.removeClass("responsive");
    original.closest(".table-wrapper").append(copy);
    copy.wrap("<div class='pinned' />");
    original.wrap("<div class='scrollable' />");
    this.setCellHeights(original, copy);
  },
  unsplitTable: function (original) {
    original.closest(".table-wrapper").find(".pinned").remove();
    original.unwrap();
    original.unwrap();
  },
  setCellHeights: function (original, copy) {
    var tr = original.find('tr'),
        tr_copy = copy.find('tr'),
        heights = [];
    tr.each(function (index) {
      var self = $(this),
          tx = self.find('th, td');

      tx.each(function () {
        var height = $(this).outerHeight(true);
        heights[index] = heights[index] || 0;
        if (height > heights[index]) heights[index] = height;
      });
    });
    tr_copy.each(function (index) {
      $(this).height(heights[index]);
    });
  },
  componentWillUnmount: function () {
    window.removeEventListener('resize');
    window.removeEventListener('redraw');
  },
  componentDidMount: function () {
    this.updateTables();
    window.addEventListener('resize', this.updateTables);
    window.addEventListener('redraw', function(){
      this.setState({switched:false});
      this.updateTables();
    }.bind(this));
    const version = browserVersion();
    if (/Chrome/.test(version)) {
      this.setState({
        onClick: () => {
          chrome.webstore.install(undefined, undefined, (err) => console.log(err));
        }
      });
    } else if (/Firefox/.test(version)) {
      this.setState({
        onClick: () => {
          window.open(
            '//addons.mozilla.org/firefox/downloads/latest/634060/addon-634060-latest.xpi',
            '_self');
        }
      });
    }
    window.addEventListener('message', (event) => {
      if (event.source != window)
        return;
      if (event.data.from == 'extension')
        switch (event.data.message) {
          case 'register':
            this.setState({
              onClick: function (retailer) {
                window.postMessage({from:'page', message:'quickAddToCart', value:retailer}, '*');
              }
            });
            break;
        }
    }, false);
    if (typeof window !== undefined) {
      //for communicating with the extension
      window.setExtensionLinks = () => {
      }
    }
  },

  render: function () {

    //get rid of this once proper BOMs are made a requirement and enforced
    //much earlier
    if (this.props.items.length === 0) {
      return (<div>{'no BOM yet'}</div>);
    }

    const keys = ['reference', 'quantity', 'description'];
    const retailers = oneClickBOM.lineData.retailer_list;
    const partNumberLength = _.max(this.props.items.map((item) => {
      return item.partNumbers.length;
    }).concat(1));
    const partNumbers = _.times(partNumberLength, _.constant('Part Number'));

    const makeHeading = (heading, index) => {
      return ( <td key={`heading-${heading}-${index}`}>{heading}</td> );
    };

    let headings = ['References', 'Qty', 'Description'].map(makeHeading);
    headings = headings.concat(partNumbers.map(makeHeading));

    const makeRetailerHeading = (retailer, index) => {
      return (
        <td key={`heading-${retailer}`} className='retailerHeading' onClick={this.state.onClick.bind(null,retailer)}>
          {retailer}<span> </span>
          <i className="fa fa-cart-plus fa-lg"></i>
        </td>
      );
    };

    headings = headings.concat(retailers.map(makeRetailerHeading));

    let rows = this.props.items.map((item, rowIndex) => {

      let row = keys.map((key) => {
        return ( <td key={`${rowIndex}-${key}`}>{ item[key] }</td> );
      });

      row = row.concat(_.times(partNumberLength, (index) => {
        let partNumber = item.partNumbers[index];
        let style = {};

        //color pink if no part numbers at all for this line
        if (index === 0 && (partNumber === '' || partNumber == null)) {
          style = {backgroundColor:'pink'};
        }

        return (
          <td key={`${item.reference}-partNumber-${index}`} style={style}>
            { partNumber }
          </td>
        );
      }));

      row = row.concat(_.keys(item.retailers).map((key, index) => {
        let style = {};
        if (item.retailers[key] === '') {
          style = {backgroundColor:'pink'};
        }
        return (
          <td key={`${item.reference}-${key}-${index}`} style={style}>
            { item.retailers[key] }
          </td>
        );
      }));

      return ( <tr className={`tr-${rowIndex % 2}`} key={`bom-tr-${rowIndex}`}>{ row }</tr> );

    });

    return (
      <table className="responsive">
        <thead>
          <tr>{ headings }</tr>
        </thead>
        <tbody>
          { rows }
        </tbody>
      </table>
    )
  }
});

module.exports = BOM;
