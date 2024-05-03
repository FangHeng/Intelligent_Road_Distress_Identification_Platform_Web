import React from 'react';
import logo from '../assets/logo-2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {faEnvelope, faFileCircleQuestion, faLink, faTimeline} from '@fortawesome/free-solid-svg-icons';

export const Nav30DataSource = {
    wrapper: {className: 'header3 home-page-wrapper jzih1dpqqrg-editor_css'},
    page: {className: 'home-page'},
    logo: {
        className: 'header3-logo ls026aoebz',
        children: logo,
    },
    Menu: {
        className: 'header3-menu',
        children: [
            {
                name: 'item1',
                className: 'header3-item',
                children: {
                    href: '#',
                    children: [
                        {
                            children: (
                                <span>
                  <span>
                    <p>获取安卓应用</p>
                  </span>
                </span>
                            ),
                            name: 'text',
                        },
                    ],
                },
                subItem: [
                    {
                        className: 'item-sub',
                        children: {
                            className: 'item-sub-item jzj8295azrs-editor_css',
                            children: [
                                {
                                    name: 'image0',
                                    className: 'item-image jzj81c9wabh-editor_css',
                                    children: 'https://s3.bmp.ovh/imgs/2024/03/01/1a2c1f78a48a3ac3.png',
                                },
                            ],
                        },
                        name: 'sub~jzj8hceysgj',
                    },
                ],
            },
            {
                name: 'item2',
                className: 'header3-item',
                children: {
                    href: `${process.env.REACT_APP_API_URL}/more`,
                    children: [
                        {
                            children: (
                                <span>
                  <p>帮助中心</p>
                </span>
                            ),
                            name: 'text',
                        },
                    ],
                },
            },
        ],
    },
    mobileMenu: {className: 'header3-mobile-menu'},
};
export const Banner50DataSource = {
    wrapper: {className: 'home-page-wrapper banner5'},
    page: {className: 'home-page banner5-page'},
    childWrapper: {
        className: 'banner5-title-wrapper',
        children: [
            {
                name: 'title',
                children: (
                    <span>
            <p>纹影探路</p>
          </span>
                ),
                className: 'banner5-title',
            },
            {
                name: 'explain',
                className: 'banner5-explain',
                children: (
                    <span>
            <p>智能道路病害分析平台</p>
          </span>
                ),
            },
            {
                name: 'content',
                className: 'banner5-content',
                children: (
                    <span>
            <p>
              纹影探路是一个创新的工业软件平台，旨在通过先进的深度学习技术，提供精确的道路病害检测和分析。它能自动识别道路裂缝、修补等常见问题，并生成详尽的状况报告，极大地提升道路维护的效率和准确性。
            </p>
          </span>
                ),
            },
            {
                name: 'button',
                className: 'banner5-button-wrapper',
                children: {
                    href: `${process.env.REACT_APP_API_URL}/`,
                    className: 'banner5-button',
                    type: 'primary',
                    children: '开始使用',
                },
            },
        ],
    },
    image: {
        className: 'banner5-image',
        children:
            'https://s3.bmp.ovh/imgs/2024/03/01/6dfe311c4ea7e87c.png',
    },
};
export const Feature60DataSource = {
    wrapper: {className: 'home-page-wrapper feature6-wrapper'},
    OverPack: {className: 'home-page feature6', playScale: 0.3},
    Carousel: {
        className: 'feature6-content',
        dots: false,
        wrapper: {className: 'feature6-content-wrapper'},
        titleWrapper: {
            className: 'feature6-title-wrapper',
            barWrapper: {
                className: 'feature6-title-bar-wrapper',
                children: {className: 'feature6-title-bar'},
            },
            title: {className: 'feature6-title'},
        },
        children: [
            {
                title: {className: 'feature6-title-text', children: '服务指标'},
                className: 'feature6-item',
                name: 'block0',
                children: [
                    {
                        md: 8,
                        xs: 24,
                        className: 'feature6-number-wrapper',
                        name: 'child0',
                        number: {
                            className: 'feature6-number',
                            unit: {className: 'feature6-unit', children: '个'},
                            toText: true,
                            children: '4',
                        },
                        children: {className: 'feature6-text', children: '模型'},
                    },
                    {
                        md: 8,
                        xs: 24,
                        className: 'feature6-number-wrapper',
                        name: 'child1',
                        number: {
                            className: 'feature6-number',
                            unit: {className: 'feature6-unit', children: '千'},
                            toText: true,
                            children: '1.17',
                        },
                        children: {className: 'feature6-text', children: '模型迭代次数'},
                    },
                    {
                        md: 8,
                        xs: 24,
                        className: 'feature6-number-wrapper',
                        name: 'child2',
                        number: {
                            className: 'feature6-number',
                            unit: {className: 'feature6-unit', children: '万'},
                            toText: true,
                            children: '6.3',
                        },
                        children: {className: 'feature6-text', children: '训练样本数量'},
                    },
                ],
            },
        ],
    },
};
export const Feature70DataSource = {
    wrapper: {className: 'home-page-wrapper feature7-wrapper'},
    page: {className: 'home-page feature7'},
    OverPack: {playScale: 0.3},
    titleWrapper: {
        className: 'feature7-title-wrapper',
        children: [
            {
                name: 'title',
                className: 'feature7-title-h1',
                children: (
                    <span>
            <span>
              <span>
                <p>功能服务</p>
              </span>
            </span>
          </span>
                ),
            },
            {
                name: 'content',
                className: 'feature7-title-content',
                children: (
                    <span>
            <p>平台提供多样的服务，确保良好的用户体验</p>
          </span>
                ),
            },
        ],
    },
    blockWrapper: {
        className: 'feature7-block-wrapper',
        gutter: 24,
        children: [
            {
                md: 6,
                xs: 24,
                name: 'block0',
                className: 'feature7-block',
                children: {
                    className: 'feature7-block-group',
                    children: [
                        {
                            name: 'image',
                            className: 'feature7-block-image',
                            children:
                                'https://s3.bmp.ovh/imgs/2024/01/30/42ee6600e7b635c1.png',
                        },
                        {
                            name: 'title',
                            className: 'feature7-block-title',
                            children: '多种模型选择',
                        },
                        {
                            name: 'content',
                            className: 'feature7-block-content',
                            children: '平台提供了四种深度学习模型，确保良好的检测效果。',
                        },
                    ],
                },
            },
            {
                md: 6,
                xs: 24,
                name: 'block1',
                className: 'feature7-block',
                children: {
                    className: 'feature7-block-group',
                    children: [
                        {
                            name: 'image',
                            className: 'feature7-block-image',
                            children:
                                'https://s3.bmp.ovh/imgs/2024/01/30/4fc94413a27acb60.png',
                        },
                        {
                            name: 'title',
                            className: 'feature7-block-title',
                            children: '精细分类结果',
                        },
                        {
                            name: 'content',
                            className: 'feature7-block-content',
                            children: '根据模型训练的标签，将检测结果分为8类，方便用户查看。',
                        },
                    ],
                },
            },
            {
                md: 6,
                xs: 24,
                name: 'block2',
                className: 'feature7-block',
                children: {
                    className: 'feature7-block-group',
                    children: [
                        {
                            name: 'image',
                            className: 'feature7-block-image',
                            children:
                                'https://s3.bmp.ovh/imgs/2024/01/29/3348c48ec3d0efaa.png',
                        },
                        {
                            name: 'title',
                            className: 'feature7-block-title',
                            children: '与纹影探路助手对话',
                        },
                        {
                            name: 'content',
                            className: 'feature7-block-content',
                            children: '内置AI助手，方便用户与平台进行交流，提供更好的使用体验。',
                        },
                    ],
                },
            },
            {
                md: 6,
                xs: 24,
                name: 'block3',
                className: 'feature7-block',
                children: {
                    className: 'feature7-block-group',
                    children: [
                        {
                            name: 'image',
                            className: 'feature7-block-image',
                            children:
                                'https://s3.bmp.ovh/imgs/2024/01/29/1fb2dd041d887bbc.png',
                        },
                        {
                            name: 'title',
                            className: 'feature7-block-title',
                            children: '生成报告',
                        },
                        {
                            name: 'content',
                            className: 'feature7-block-content',
                            children: '大模型助力报告生成，提供更加精细的报告内容。',
                        },
                    ],
                },
            },
            {
                md: 6,
                xs: 24,
                name: 'block4',
                className: 'feature7-block',
                children: {
                    className: 'feature7-block-group',
                    children: [
                        {
                            name: 'image',
                            className: 'feature7-block-image',
                            children:
                                'https://s3.bmp.ovh/imgs/2024/01/29/f7a6d4f2476848a8.png',
                        },
                        {
                            name: 'title',
                            className: 'feature7-block-title',
                            children: '跨平台应用',
                        },
                        {
                            name: 'content',
                            className: 'feature7-block-content',
                            children: '平台提供Android应用和Web网页，方便用户随时随地使用平台服务。',
                        },
                    ],
                },
            },
            {
                md: 6,
                xs: 24,
                name: 'block5',
                className: 'feature7-block',
                children: {
                    className: 'feature7-block-group',
                    children: [
                        {
                            name: 'image',
                            className: 'feature7-block-image',
                            children:
                                'https://s3.bmp.ovh/imgs/2024/01/29/fd4bdd9ceac03353.png',
                        },
                        {
                            name: 'title',
                            className: 'feature7-block-title',
                            children: '丰富的可视化',
                        },
                        {
                            name: 'content',
                            className: 'feature7-block-content',
                            children: '对每次检测结果，提供地图、图表等多种可视化，方便用户查看。',
                        },
                    ],
                },
            },
            {
                md: 6,
                xs: 24,
                name: 'block6',
                className: 'feature7-block',
                children: {
                    className: 'feature7-block-group',
                    children: [
                        {
                            name: 'image',
                            className: 'feature7-block-image',
                            children:
                                'https://s3.bmp.ovh/imgs/2024/01/30/7a8e7592c3fcb809.png',
                        },
                        {
                            name: 'title',
                            className: 'feature7-block-title',
                            children: '精美UI界面',
                        },
                        {
                            name: 'content',
                            className: 'feature7-block-content',
                            children: '平台提供简洁美观的UI界面，为用户的使用提供更好的体验。',
                        },
                    ],
                },
            },
            {
                md: 6,
                xs: 24,
                name: 'block7',
                className: 'feature7-block',
                children: {
                    className: 'feature7-block-group',
                    children: [
                        {
                            name: 'image',
                            className: 'feature7-block-image',
                            children:
                                'https://s3.bmp.ovh/imgs/2024/01/30/7b1245b0626c80bb.png',
                        },
                        {
                            name: 'title',
                            className: 'feature7-block-title',
                            children: '接入现有企业',
                        },
                        {
                            name: 'content',
                            className: 'feature7-block-content',
                            children: '无缝接入现有企业，尽量与平台的工号一致、公司用户分级。',
                        },
                    ],
                },
            },
        ],
    },
};
export const Feature80DataSource = {
    wrapper: {className: 'home-page-wrapper feature8-wrapper'},
    page: {className: 'home-page feature8'},
    OverPack: {playScale: 0.3},
    titleWrapper: {
        className: 'feature8-title-wrapper',
        children: [
            {name: 'title', className: 'feature8-title-h1', children: '使用流程'},
            {
                name: 'content',
                className: 'feature8-title-content',
                children: (
                    <span>
            <p>平台提供便捷的使用流程</p>
          </span>
                ),
            },
        ],
    },
    childWrapper: {
        className: 'feature8-button-wrapper',
        children: [
            {
                name: 'button',
                className: 'feature8-button',
                children: {
                    href: `${process.env.REACT_APP_API_URL}/`,
                    children: (
                        <p style={{marginTop: '10px'}}>
                            立即体验
                        </p>
                    ),
                    type: 'primary',
                },
            },
        ],
    },
    Carousel: {
        dots: false,
        className: 'feature8-carousel',
        wrapper: {className: 'feature8-block-wrapper'},
        children: {
            className: 'feature8-block',
            titleWrapper: {
                className: 'feature8-carousel-title-wrapper',
                title: {className: 'feature8-carousel-title'},
            },
            children: [
                {
                    name: 'block0',
                    className: 'feature8-block-row',
                    gutter: 120,
                    title: {
                        className: 'feature8-carousel-title-block',
                        children: (
                            <span>
                <span>
                  <span>
                    <span>
                      <p>文件上传</p>
                    </span>
                  </span>
                </span>
              </span>
                        ),
                    },
                    children: [
                        {
                            className: 'feature8-block-col',
                            md: 6,
                            xs: 24,
                            name: 'child0',
                            arrow: {
                                className: 'feature8-block-arrow',
                                children:
                                    'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
                            },
                            children: {
                                className: 'feature8-block-child',
                                children: [
                                    {
                                        name: 'image',
                                        className: 'feature8-block-image',
                                        children:
                                            'https://s3.bmp.ovh/imgs/2024/01/28/a322080a474356e9.png',
                                    },
                                    {
                                        name: 'title',
                                        className: 'feature8-block-title',
                                        children: (
                                            <span>
                        <p>道路信息录入</p>
                      </span>
                                        ),
                                    },
                                    {
                                        name: 'content',
                                        className: 'feature8-block-content',
                                        children: (
                                            <span>
                        <span>
                          <p>在进行图片上传之前需要完成道路信息的录入</p>
                        </span>
                      </span>
                                        ),
                                    },
                                ],
                            },
                        },
                        {
                            className: 'feature8-block-col',
                            md: 6,
                            xs: 24,
                            name: 'child1',
                            arrow: {
                                className: 'feature8-block-arrow',
                                children:
                                    'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
                            },
                            children: {
                                className: 'feature8-block-child',
                                children: [
                                    {
                                        name: 'image',
                                        className: 'feature8-block-image',
                                        children:
                                            'https://s3.bmp.ovh/imgs/2024/01/28/276f87d3d6657510.png',
                                    },
                                    {
                                        name: 'title',
                                        className: 'feature8-block-title',
                                        children: (
                                            <span>
                        <p>选择模型</p>
                      </span>
                                        ),
                                    },
                                    {
                                        name: 'content',
                                        className: 'feature8-block-content',
                                        children: (
                                            <span>
                        <span>
                          <p>选择进行分析的模型，不同模型会有不同的特性</p>
                        </span>
                      </span>
                                        ),
                                    },
                                ],
                            },
                        },
                        {
                            className: 'feature8-block-col',
                            md: 6,
                            xs: 24,
                            name: 'child2',
                            arrow: {
                                className: 'feature8-block-arrow',
                                children:
                                    'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
                            },
                            children: {
                                className: 'feature8-block-child',
                                children: [
                                    {
                                        name: 'image',
                                        className: 'feature8-block-image',
                                        children:
                                            'https://s3.bmp.ovh/imgs/2024/01/28/ce42b1d5de9ce200.png',
                                    },
                                    {
                                        name: 'title',
                                        className: 'feature8-block-title',
                                        children: (
                                            <span>
                        <span>
                          <p>选择上传文件</p>
                        </span>
                      </span>
                                        ),
                                    },
                                    {
                                        name: 'content',
                                        className: 'feature8-block-content',
                                        children: (
                                            <span>
                        <p>在文件上传界面批量选择需要分析的照片文件</p>
                      </span>
                                        ),
                                    },
                                ],
                            },
                        },
                        {
                            className: 'feature8-block-col',
                            md: 6,
                            xs: 24,
                            name: 'child3',
                            arrow: {
                                className: 'feature8-block-arrow',
                                children:
                                    'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
                            },
                            children: {
                                className: 'feature8-block-child',
                                children: [
                                    {
                                        name: 'image',
                                        className: 'feature8-block-image',
                                        children:
                                            'https://s3.bmp.ovh/imgs/2024/01/29/f8742b95b7d2d903.png',
                                    },
                                    {
                                        name: 'title',
                                        className: 'feature8-block-title',
                                        children: (
                                            <span>
                        <span>
                          <span>
                            <p>完善上传信息并提交</p>
                          </span>
                        </span>
                      </span>
                                        ),
                                    },
                                    {
                                        name: 'content',
                                        className: 'feature8-block-content',
                                        children: (
                                            <span>
                        <p>选择对应注册的道路并完善上传名等信息后提交</p>
                      </span>
                                        ),
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    name: 'block1',
                    className: 'feature8-block-row',
                    gutter: 120,
                    title: {
                        children: (
                            <span>
                <span>
                  <span>
                    <p>结果展示</p>
                  </span>
                </span>
              </span>
                        ),
                        className: 'feature8-carousel-title-block',
                    },
                    children: [
                        {
                            className: 'feature8-block-col',
                            md: 6,
                            xs: 24,
                            name: 'child0',
                            arrow: {
                                className: 'feature8-block-arrow',
                                children:
                                    'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
                            },
                            children: {
                                className: 'feature8-block-child',
                                children: [
                                    {
                                        name: 'image',
                                        className: 'feature8-block-image',
                                        children:
                                            'https://s3.bmp.ovh/imgs/2024/01/28/2f6067027de48196.png',
                                    },
                                    {
                                        name: 'title',
                                        className: 'feature8-block-title',
                                        children: (
                                            <span>
                        <span>
                          <p>总体可视化</p>
                        </span>
                      </span>
                                        ),
                                    },
                                    {
                                        name: 'content',
                                        className: 'feature8-block-content',
                                        children: (
                                            <span>
                        <p>
                          对选择的上传记录<span>进行全面整体的展</span>
                          <span>示，便于整体把控</span>
                        </p>
                      </span>
                                        ),
                                    },
                                ],
                            },
                        },
                        {
                            className: 'feature8-block-col',
                            md: 6,
                            xs: 24,
                            name: 'child1',
                            arrow: {
                                className: 'feature8-block-arrow',
                                children:
                                    'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
                            },
                            children: {
                                className: 'feature8-block-child',
                                children: [
                                    {
                                        name: 'image',
                                        className: 'feature8-block-image',
                                        children:
                                            'https://s3.bmp.ovh/imgs/2024/01/28/ff808e66212e69a1.png',
                                    },
                                    {
                                        name: 'title',
                                        className: 'feature8-block-title',
                                        children: (
                                            <span>
                        <p>
                          图片分析<span>结果可视化</span>
                        </p>
                      </span>
                                        ),
                                    },
                                    {
                                        name: 'content',
                                        className: 'feature8-block-content',
                                        children: (
                                            <span>
                        <p>
                          针对每一张图片<span>分析结果看板化</span>
                          <span>地展示识别结果</span>
                        </p>
                      </span>
                                        ),
                                    },
                                ],
                            },
                        },
                        {
                            className: 'feature8-block-col',
                            md: 6,
                            xs: 24,
                            name: 'child2',
                            arrow: {
                                className: 'feature8-block-arrow',
                                children:
                                    'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
                            },
                            children: {
                                className: 'feature8-block-child',
                                children: [
                                    {
                                        name: 'image',
                                        className: 'feature8-block-image',
                                        children:
                                            'https://s3.bmp.ovh/imgs/2024/01/28/7be9fe7d16ba8dd6.png',
                                    },
                                    {
                                        name: 'title',
                                        className: 'feature8-block-title',
                                        children: (
                                            <span>
                        <p>
                          分析结果<span>批量导出</span>
                        </p>
                      </span>
                                        ),
                                    },
                                    {
                                        name: 'content',
                                        className: 'feature8-block-content',
                                        children: (
                                            <span>
                        <p>将选择的记录中的详细信息以Excel形式导出</p>
                      </span>
                                        ),
                                    },
                                ],
                            },
                        },
                        {
                            className: 'feature8-block-col',
                            md: 6,
                            xs: 24,
                            name: 'child3',
                            arrow: {
                                className: 'feature8-block-arrow',
                                children:
                                    'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
                            },
                            children: {
                                className: 'feature8-block-child',
                                children: [
                                    {
                                        name: 'image',
                                        className: 'feature8-block-image',
                                        children:
                                            'https://s3.bmp.ovh/imgs/2024/01/28/de1da856d7c15650.png',
                                    },
                                    {
                                        name: 'title',
                                        className: 'feature8-block-title',
                                        children: (
                                            <span>
                        <p>
                          对话回答与报告生成<br/>
                        </p>
                      </span>
                                        ),
                                    },
                                    {
                                        name: 'content',
                                        className: 'feature8-block-content',
                                        children: (
                                            <span>
                        <span>
                          <p>
                            关于选择的记录可以使用对话的形式与AI助手交流，使用大语言模型生成灵活的分析报告
                          </p>
                        </span>
                      </span>
                                        ),
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
        },
    },
};
export const Footer11DataSource = {
    wrapper: {className: 'home-page-wrapper footer1-wrapper'},
    OverPack: {className: 'footer1', playScale: 0.2},
    block: {
        className: 'home-page',
        gutter: 0,
        children: [
            {
                name: 'block0',
                xs: 24,
                md: 6,
                className: 'block',
                title: {
                    className: 'logo',
                    children: (
                        'https://s3.bmp.ovh/imgs/2024/01/30/0abb273d157b937f.png'
                    ),
                },
                childWrapper: {
                    className: 'slogan',
                    children: [
                        {
                            name: 'content0',
                            children: (
                                <span>
                  <p>创新视野，精准检测，为路面安全保驾护航。</p>
                </span>
                            ),
                        },
                    ],
                },
            },
            {
                name: 'block1',
                xs: 24,
                md: 6,
                className: 'block',
                title: {children: '产品'},
                childWrapper: {
                    children: [
                        {
                            name: 'link0',
                            href: `${process.env.REACT_APP_API_URL}/more/release-notes`,
                            children: (
                                <span>
                    <p><FontAwesomeIcon icon={faTimeline} style={{ marginRight: '5px' }}/>版本更新</p>
                    </span>
                                )
                        },
                        // { name: 'link1', href: '#', children: 'API文档' },
                        // { name: 'link2', href: '#', children: '快速入门' },
                        {name: 'link3', href: '#', children: (
                                <span>
                    <p><FontAwesomeIcon icon={faLink} style={{ marginRight: '5px' }}/>参考文档</p>
                    </span>

                            )},
                    ],
                },
            },
            {
                name: 'block2',
                xs: 24,
                md: 6,
                className: 'block',
                title: {children: '关于'},
                childWrapper: {
                    children: [
                        {href: `${process.env.REACT_APP_API_URL}/more/FAQ`,
                            name: 'link0',
                            children: (
                                <span>
                    <p><FontAwesomeIcon icon={faFileCircleQuestion} style={{ marginRight: '5px' }}/>FAQ</p>
                    </span>
                            )
                        },
                        {
                            href: 'mailto:hengfang2002@qq.com?subject=邮件主题&body=邮件正文内容',
                            name: 'link1',
                            children: (
                                <span>
                    <p><FontAwesomeIcon icon={faEnvelope}  style={{ marginRight: '5px' }}/>联系我们</p>
                    </span>
                            )
                        }
                    ],
                },
            },
            {
                name: 'block3',
                xs: 24,
                md: 6,
                className: 'block',
                title: {children: '资源'},
                childWrapper: {
                    children: [
                        {
                            href: 'https://github.com/FangHeng/Intelligent_Road_Distress_Identification_Platform_Web',
                            name: 'link0',
                            children: (
                                <span>
                  <p><FontAwesomeIcon icon={faGithub} style={{ marginRight: '5px' }}/>Web GitHub地址</p>
                </span>
                            ),
                        },
                        {
                            href: 'https://github.com/FangHeng/Intelligent_Road_Distress_Identification_Platform_Android',
                            name: 'link1',
                            children: (
                                <span>
                  <p><FontAwesomeIcon icon={faGithub} style={{ marginRight: '5px' }}/>Android GitHub地址</p>
                </span>
                            ),
                        }
                    ],

                },
            },
        ],
    },
    copyrightWrapper: {className: 'copyright-wrapper'},
    copyrightPage: {className: 'home-page'},
    copyright: {
        className: 'copyright',
        children: (
            <span>
                ©2024 by <a href={process.env.REACT_APP_API_URL}>
                纹影探路</a> All Rights Reserved
            </span>
        ),
    },
};
