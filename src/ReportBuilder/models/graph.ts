import { IGraphNode, ReportSortDirectionType } from 'peekdata-datagateway-api-sdk';

export interface IDimension extends IGraphNode { }

export interface IMetric extends IGraphNode { }

export interface ISelectedGraphNode {
  value?: string;
  sorting?: ReportSortDirectionType;
}

export function isGraphNode(graphNode: string | IGraphNode): graphNode is IGraphNode {
  if (!graphNode) {
    return false;
  }

  return (graphNode as IGraphNode).name !== undefined;
}
