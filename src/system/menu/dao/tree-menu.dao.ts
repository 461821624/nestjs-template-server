import { ApiProperty } from '@nestjs/swagger';
export class TreeMenuDao {
  @ApiProperty()
  id: string;
  @ApiProperty()
  path: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  sort: number;
  @ApiProperty()
  parent_id: number;
  @ApiProperty()
  icon: string;
  @ApiProperty()
  component: string;
  @ApiProperty()
  status: number;
  @ApiProperty()
  ignoreCache: number;
  @ApiProperty()
  hideInMenu: number;
  @ApiProperty()
  locale;
  @ApiProperty({ type: () => TreeMenuDao })
  children: TreeMenuDao[];
}
